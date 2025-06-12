import graph from "$lib/server/MsGraph.js";
import type { PageServerLoad } from "./$types.js";

// Define or import the User type
type User = {
    id: string;
    displayName: string;
    email: string;
};

export const load: PageServerLoad =(async () => {
    await graph.initializeClient();
    if (!graph.isReady()) {
        return {
            userList: [],
            eventsList: [],
            error: 'Graph client is not ready. Please check your configuration.'
        };
    }

    const users = await graph.getUsersAsync();
    const userList : User[] = users.value
        .map((user: { id: string; displayName: string; mail: string;}) => ({
            id: user.id,
            displayName: user.displayName,
            email: user.mail || "No email provided"
        }));

        // Fetch places(meeting rooms) and calendar events
    const places = await graph.getPlacesAsync();
    console.log("Places:", places);


    const calendarEvents = await graph.getCalandarEventsAsync("Galaxy@azitconsult.onmicrosoft.com");
    const eventsList = calendarEvents.value.map((event: { subject: string; start: { dateTime: string }; end: { dateTime: string };}) => ({
        subject: event.subject,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
    }));

    return { userList, eventsList };
}) satisfies PageServerLoad;
