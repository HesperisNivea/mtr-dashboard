export type AgendaEvent = {
	id: string;
	emailAddress: string;
	subject: string;
	location: { displayName: string };
	start: { dateTime: string };
	end: { dateTime: string };
};
