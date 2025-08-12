import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { 
  getRooms, 
  addRoom, 
  removeRoom, 
  toggleRoomDisplay, 
  refreshRoomsFromTenant,
  validateRoomEmail,
  addRoomWithValidation
} from '$lib/server/RoomsManager.js';
import type { Room } from '../../../types/room.js';

export const GET: RequestHandler = async () => {
  try {
    const rooms = await getRooms();
    return json({ rooms, success: true });
  } catch (error) {
    console.error('Error getting rooms:', error);
    return json({ 
      error: error instanceof Error ? error.message : 'Failed to get rooms',
      success: false 
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action, room, roomId, email } = await request.json();

    switch (action) {
      case 'validate': {
        if (!email) {
          return json({ error: 'Email is required for validation', success: false }, { status: 400 });
        }
        const validation = await validateRoomEmail(email);
        return json({ 
          success: validation.isValid, 
          room: validation.room,
          error: validation.error,
          message: validation.isValid ? 'Room found in tenant' : validation.error 
        });
      }

      case 'addWithValidation': {
        if (!email) {
          return json({ error: 'Email is required', success: false }, { status: 400 });
        }
        const addedRoom = await addRoomWithValidation(email);
        return json({ 
          success: true, 
          message: 'Room validated and added successfully',
          room: addedRoom 
        });
      }

      case 'add':
        if (!room) {
          return json({ error: 'Room data is required', success: false }, { status: 400 });
        }
        await addRoom(room as Room);
        return json({ success: true, message: 'Room added successfully' });

      case 'remove':
        if (!roomId) {
          return json({ error: 'Room ID is required', success: false }, { status: 400 });
        }
        await removeRoom(roomId);
        return json({ success: true, message: 'Room removed successfully' });

      case 'toggle':
        if (!roomId) {
          return json({ error: 'Room ID is required', success: false }, { status: 400 });
        }
        await toggleRoomDisplay(roomId);
        return json({ success: true, message: 'Room display status toggled successfully' });

      case 'refresh': {
        const refreshedRooms = await refreshRoomsFromTenant();
        return json({ 
          success: true, 
          message: 'Rooms refreshed from tenant successfully',
          rooms: refreshedRooms 
        });
      }

      default:
        return json({ error: 'Invalid action', success: false }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling room operation:', error);
    return json({ 
      error: error instanceof Error ? error.message : 'Operation failed',
      success: false 
    }, { status: 500 });
  }
};
