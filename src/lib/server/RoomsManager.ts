
import fs from 'fs';
import path from 'path';
import type { Room } from '../../types/room.js';
import graph from './MsGraph.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOMS_PATH = path.join(__dirname, '../../../data/rooms.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(ROOMS_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// add room to the list
const addRoom = async (room: Room) => {
  ensureDataDirectory();
  const rooms = await getRooms();
  
  // Check if room already exists
  const existingRoom = rooms.find(r => r.id === room.id || r.emailAddress === room.emailAddress);
  if (existingRoom) {
    throw new Error('Room with this ID or email already exists');
  }
  
  rooms.push(room);
  fs.writeFileSync(ROOMS_PATH, JSON.stringify(rooms, null, 2));
};

// remove room from the list
const removeRoom = async (roomId: string) => {
  const rooms = await getRooms();
  const updatedRooms = rooms.filter(room => room.id !== roomId);
  fs.writeFileSync(ROOMS_PATH, JSON.stringify(updatedRooms, null, 2));
};

// get rooms
const getRooms = async (): Promise<Room[]> => {
  if (!fs.existsSync(ROOMS_PATH)) {
    return [];
  }
  try {
    const data = fs.readFileSync(ROOMS_PATH, 'utf-8');
    return JSON.parse(data) as Room[];
  } catch (error) {
    console.error('Error reading rooms file:', error);
    return [];
  }
};

// update/override rooms
const updateRoom = async (roomId: string, updatedRoom: Partial<Room>) => {
  const rooms = await getRooms();
  const roomIndex = rooms.findIndex((room: Room) => room.id === roomId);
  if (roomIndex === -1) {
    throw new Error(`Room with id ${roomId} not found`);
  }
  rooms[roomIndex] = { ...rooms[roomIndex], ...updatedRoom };
  fs.writeFileSync(ROOMS_PATH, JSON.stringify(rooms, null, 2));
};

// toggle room display status
const toggleRoomDisplay = async (roomId: string) => {
  const rooms = await getRooms();
  const roomIndex = rooms.findIndex((room: Room) => room.id === roomId);
  if (roomIndex === -1) {
    throw new Error(`Room with id ${roomId} not found`);
  }
  rooms[roomIndex].isDisplayed = !rooms[roomIndex].isDisplayed;
  fs.writeFileSync(ROOMS_PATH, JSON.stringify(rooms, null, 2));
};

// fetch rooms from MS Graph and override local list
const fetchRoomsFromTenant = async (): Promise<Room[]> => {
  try {
    // Use centralized tenant connection validation
    const connectionResult = await graph.ensureTenantConnection();
    
    if (!connectionResult.success) {
      throw new Error(connectionResult.error || 'Failed to connect to tenant');
    }

    // Get places (rooms) from MS Graph
    const placesResponse = await graph.getPlacesAsync();
    
    if (placesResponse?.value) {
      const fetchedRooms: Room[] = placesResponse.value.map((place: unknown): Room => {
        const roomPlace = place as Record<string, unknown>;
        return {
          id: (roomPlace.id as string) || '',
          displayName: (roomPlace.displayName as string) || 'Unknown Room',
          emailAddress: (roomPlace.emailAddress as string) || '',
          phone: (roomPlace.phone as string) || undefined,
          building: (roomPlace.building as string) || undefined,
          floor: (roomPlace.floor as string) || undefined,
          capacity: (roomPlace.capacity as number) || undefined,
          bookingType: (roomPlace.bookingType as string) || undefined,
          tags: (roomPlace.tags as string[]) || [],
          isDisplayed: false // Default to not displayed
        };
      });
      
      return fetchedRooms;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching rooms from tenant:', error);
    throw error;
  }
};

// override local rooms with fetched rooms
const refreshRoomsFromTenant = async (): Promise<Room[]> => {
  const fetchedRooms = await fetchRoomsFromTenant();
  const currentRooms = await getRooms();
  
  // Preserve display status for existing rooms
  const updatedRooms = fetchedRooms.map(fetchedRoom => {
    const existingRoom = currentRooms.find(room => 
      room.id === fetchedRoom.id || room.emailAddress === fetchedRoom.emailAddress
    );
    
    return {
      ...fetchedRoom,
      isDisplayed: existingRoom?.isDisplayed || false
    };
  });
  
  ensureDataDirectory();
  fs.writeFileSync(ROOMS_PATH, JSON.stringify(updatedRooms, null, 2));
  return updatedRooms;
};

// validate room email against tenant
const validateRoomEmail = async (email: string): Promise<{ isValid: boolean; room?: Room; error?: string }> => {
  try {
    // Use centralized tenant connection validation
    const connectionResult = await graph.ensureTenantConnection();
    
    if (!connectionResult.success) {
      return { isValid: false, error: connectionResult.error };
    }

    // Get places (rooms) from MS Graph
    const placesResponse = await graph.getPlacesAsync();
    
    if (placesResponse?.value) {
      const foundRoom = placesResponse.value.find((place: unknown) => {
        const roomPlace = place as Record<string, unknown>;
        return (roomPlace.emailAddress as string)?.toLowerCase() === email.toLowerCase();
      });

      if (foundRoom) {
        const roomPlace = foundRoom as Record<string, unknown>;
        const validatedRoom: Room = {
          id: (roomPlace.id as string) || '',
          displayName: (roomPlace.displayName as string) || 'Unknown Room',
          emailAddress: (roomPlace.emailAddress as string) || '',
          phone: (roomPlace.phone as string) || undefined,
          building: (roomPlace.building as string) || undefined,
          floor: (roomPlace.floor as string) || undefined,
          capacity: (roomPlace.capacity as number) || undefined,
          bookingType: (roomPlace.bookingType as string) || undefined,
          tags: (roomPlace.tags as string[]) || [],
          isDisplayed: false // Default to not displayed
        };
        
        return { isValid: true, room: validatedRoom };
      } else {
        return { isValid: false, error: 'Room with this email address was not found in your tenant.' };
      }
    }
    
    return { isValid: false, error: 'No rooms found in tenant.' };
  } catch (error) {
    console.error('Error validating room email:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Failed to validate room email' 
    };
  }
};

// add room with validation
const addRoomWithValidation = async (email: string): Promise<Room> => {
  const validation = await validateRoomEmail(email);
  
  if (!validation.isValid || !validation.room) {
    throw new Error(validation.error || 'Room validation failed');
  }

  // Check if room already exists in local storage
  const existingRooms = await getRooms();
  const existingRoom = existingRooms.find(r => 
    r.id === validation.room!.id || 
    r.emailAddress?.toLowerCase() === email.toLowerCase()
  );
  
  if (existingRoom) {
    throw new Error('Room is already in your list');
  }

  await addRoom(validation.room);
  return validation.room;
};

// get only displayed rooms
const getDisplayedRooms = async (): Promise<Room[]> => {
  const rooms = await getRooms();
  return rooms.filter(room => room.isDisplayed);
};

export {
  addRoom,
  removeRoom,
  getRooms,
  updateRoom,
  toggleRoomDisplay,
  fetchRoomsFromTenant,
  refreshRoomsFromTenant,
  getDisplayedRooms,
  validateRoomEmail,
  addRoomWithValidation
}; 