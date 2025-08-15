import 'isomorphic-fetch';

import { ClientSecretCredential } from '@azure/identity';
import { Client, type PageCollection } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import { getConfig, hasValidConfig } from './tokenManager.js';
import type { AgendaEvent } from '../../types/agenda.js';

class MsGraph {
	private client: Client | null = null;
	public isValid: boolean = false;

	constructor() {
		this.client = null;
	}

	public async initializeClient(): Promise<boolean> {
		try {
			if (!hasValidConfig()) {
				this.client = null;
				return false;
			}

			const config = getConfig();
			const credential = new ClientSecretCredential(
				config.tenantId,
				config.clientId,
				config.clientSecret
			);

			const authProvider = new TokenCredentialAuthenticationProvider(credential, {
				scopes: ['https://graph.microsoft.com/.default']
			});

			this.client = Client.initWithMiddleware({ authProvider });
			return true;
		} catch (error) {
			console.error('Error initializing Microsoft Graph client:', error);
			this.client = null;
			return false;
		}
	}

	public isReady(): boolean {
		return this.client !== null;
	}

	public async validateClientAsync(): Promise<boolean> {
		if (!this.client) {
			throw new Error('Client is not initialized.');
		}
		try {
			// Attempt to get the current user's profile to validate the client
			await this.client
				.api('/users/')
				.select(['displayName', 'id', 'mail'])
				.top(1)
				.orderby('displayName')
				.get();

			this.isValid = true;
			return true;
		} catch (error) {
			console.error('Error validating Microsoft Graph client:', error);
			this.isValid = false;
			return false;
		}
	}

	public async getUsersAsync(): Promise<PageCollection> {
		if (!this.client) {
			throw new Error('Client is not initialized.');
		}

		return this.client
			.api('/users/')
			.select(['displayName', 'id', 'mail'])
			.top(25)
			.orderby('displayName')
			.get();
	}

	public async getCalendarEventsAsync(emailAddress: string): Promise<AgendaEvent[]> {
		if (!this.client) {
			throw new Error('Client is not initialized.');
		}

		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const startDateTime = startOfDay.toISOString();
		const endDateTime = endOfDay.toISOString();

		const events = await this.client
			.api(`/users/${emailAddress}/calendar/events`)
			.filter(`start/dateTime ge '${startDateTime}' and end/dateTime le '${endDateTime}'`)
			.select(['subject', 'start', 'end', 'location', 'attendees'])
			.orderby('start/dateTime')
			.get();

		console.log(JSON.stringify(events, null, 2));

		return events.value.map(
			(event: {
				id: string;
				subject: string;
				location: { displayName: string };
				start: { dateTime: string };
				end: { dateTime: string };
			}) => ({
				id: event.id,
				subject: event.subject,
				emailAddress: emailAddress,
				location: {
					displayName: event.location.displayName
				},
				start: {
					dateTime: event.start.dateTime
				},
				end: {
					dateTime: event.end.dateTime
				}
			})
		);
	}

	//Old getCalendarEventsAsync

	// public async getCalandarEventsAsync(userId : string): Promise<PageCollection> {
	//     if(!this.client) {
	//         throw new Error("Client is not initialized.");
	//     }

	//     return this.client.api(`/users/${userId}/calendar/events`)
	//     .top(25)
	//     .orderby('start/dateTime')
	//     .get();
	// }

	public async getPlacesAsync(): Promise<PageCollection> {
		if (!this.client) {
			throw new Error('Client is not initialized.');
		}
		const response = await this.client.api(`/places/microsoft.graph.room`).get();
		return response;
	}

	/**
	 * Ensures the client is initialized and validated for tenant operations.
	 * This is a centralized method to avoid duplicating initialization logic.
	 * @returns Promise<{ success: boolean; error?: string }>
	 */
	public async ensureTenantConnection(): Promise<{ success: boolean; error?: string }> {
		try {
			// Step 1: Initialize the client if not already done
			const isInitialized = await this.initializeClient();

			if (!isInitialized) {
				return {
					success: false,
					error: 'MS Graph client not configured. Please configure your credentials first.'
				};
			}

			// Step 2: Validate the client connection
			const isValid = await this.validateClientAsync();

			if (!isValid) {
				return {
					success: false,
					error: 'Invalid MS Graph credentials. Please check your configuration.'
				};
			}

			return { success: true };
		} catch (error) {
			console.error('Error ensuring tenant connection:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to establish tenant connection'
			};
		}
	}
}

const graph = new MsGraph();
export default graph;
