export type AgendaEvent = {
	id: string;
	subject: string;
	emailAddress: string;
	location: {
		displayName: string;
	};
	start: {
		dateTime: string;
	};
	end: {
		dateTime: string;
	};
};
