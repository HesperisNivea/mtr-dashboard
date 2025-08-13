import graph from '$lib/server/MsGraph.js';
import { getDisplayedRooms } from '$lib/server/RoomsManager.js';
import type { PageServerLoad } from './$types.js';
import type { AgendaEvent } from '../types/agenda.js';
import type { Room } from '../types/room.js';

export const load: PageServerLoad = (async () => {
	// Use tenant connection validation
	const connectionResult = await graph.ensureTenantConnection();

	//if tenant isn't valid, redirect to setup page and open a dialog with connection configuration
	if (!connectionResult.success) {
		return {
			roomEvents: {},
			displayedRooms: [],
			error: connectionResult.error || 'Graph client is not ready. Please check your configuration.'
		};
	}

	try {
		// Get only displayed rooms from local storage
		const displayedRooms: Room[] = await getDisplayedRooms();

		// Fetch calendar events from today for displayed rooms

		const roomEvents: Record<string, AgendaEvent[]> = {};

		for (const room of displayedRooms) {
			const events = await graph.getCalendarEventsAsync(room.emailAddress);
			roomEvents[room.id] = events;
		}

		return {
			roomEvents,
			displayedRooms,
			error: undefined
		};
	} catch (error) {
		console.error('Error loading dashboard data:', error);
		return {
			roomEvents: {},
			displayedRooms: [],
			error: error instanceof Error ? error.message : 'Failed to load dashboard data'
		};
	}
}) satisfies PageServerLoad;
