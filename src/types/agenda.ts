export type AgendaEvent = {
	id: string;
	subject: string;
	bodyPreview: string;
	location: { displayName: string };
	organizer: { emailAddress: { name: string; address: string } };
	attendees: { emailAddress: { name: string; address: string } }[];
	start: { dateTime: string };
	end: { dateTime: string };
};
