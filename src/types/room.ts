export type Room = {
	id: string;
	displayName: string;
	emailAddress: string;
	phone?: string;
	building?: string;
	floor?: string;
	capacity?: number;
	bookingType?: string;
	tags?: string[];
	isDisplayed?: boolean;
};

export type RoomsData = {
	rooms: Room[];
	error?: string;
};
