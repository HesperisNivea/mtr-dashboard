import graph from '$lib/server/MsGraph.js';

export const GET = async ({ params }: { params: { roomsEmailAddress: string } }) => {
	const { roomsEmailAddress } = params;

	// Fetch calendar events for the specified room
	const events = await graph.getCalendarEventsAsync(roomsEmailAddress);

	return {
		status: 200,
		body: events
	};
};
