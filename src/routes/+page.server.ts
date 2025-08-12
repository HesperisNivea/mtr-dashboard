import graph from "$lib/server/MsGraph.js";
import { getDisplayedRooms } from "$lib/server/RoomsManager.js";
import type { PageServerLoad } from "./$types.js";

// Define or import the User type
type User = {
    id: string;
    displayName: string;
    email: string;
};

export const load: PageServerLoad = (async () => {
    // Use centralized tenant connection validation
    const connectionResult = await graph.ensureTenantConnection();
    
    if (!connectionResult.success) {
        return {
            userList: [],
            eventsList: [],
            displayedRooms: [],
            error: connectionResult.error || 'Graph client is not ready. Please check your configuration.'
        };
    }

    try {
        const users = await graph.getUsersAsync();
        const userList: User[] = users.value
            .map((user: { id: string; displayName: string; mail: string; }) => ({
                id: user.id,
                displayName: user.displayName,
                email: user.mail || "No email provided"
            }));

        // Get only displayed rooms from local storage
        const displayedRooms = await getDisplayedRooms();

        // Fetch calendar events for displayed rooms
        let eventsList: Array<{
            subject: string;
            start: Date;
            end: Date;
            roomId: string;
            roomName: string;
        }> = [];
        if (displayedRooms.length > 0) {
            // For now, let's get events from the first displayed room as an example
            // You can modify this logic based on your needs
            const firstRoom = displayedRooms[0];
            if (firstRoom.emailAddress) {
                try {
                    const calendarEvents = await graph.getCalandarEventsAsync(firstRoom.emailAddress);
                    eventsList = calendarEvents.value.map((event: { subject: string; start: { dateTime: string }; end: { dateTime: string }; }) => ({
                        subject: event.subject,
                        start: new Date(event.start.dateTime),
                        end: new Date(event.end.dateTime),
                        roomId: firstRoom.id,
                        roomName: firstRoom.displayName
                    }));
                } catch (error) {
                    console.error('Error fetching calendar events:', error);
                }
            }
        }

        return { 
            userList, 
            eventsList, 
            displayedRooms,
            error: undefined 
        };
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        return {
            userList: [],
            eventsList: [],
            displayedRooms: [],
            error: error instanceof Error ? error.message : 'Failed to load dashboard data'
        };
    }
}) satisfies PageServerLoad;
