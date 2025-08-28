import graph from '$lib/server/MsGraph.js';

export const GET = async ({ url }: { url: URL }) => {
	const roomEmail = url.searchParams.get('roomEmail');

	if (!roomEmail) {
		return new Response(JSON.stringify({ error: 'Room email is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		// Fetch calendar events for the specified room using the graph class
		const events = await graph.getCalendarEventsAsync(roomEmail);

		console.log(`Fetched events for ${roomEmail}:`);

		return new Response(JSON.stringify(events), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error fetching events:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
