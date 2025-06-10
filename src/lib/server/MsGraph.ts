import "isomorphic-fetch";

import { ClientSecretCredential } from "@azure/identity";
import { Client, type PageCollection } from "@microsoft/microsoft-graph-client";
// prettier-ignore
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { getConfig, hasValidConfig } from './tokenManager.js';


    class MsGraph {
    private client : Client | null = null;

    constructor() {
        this.client = null;
    }
    
    public async initializeClient(): Promise<boolean> {
        try {  
            if(!hasValidConfig())
            {
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
                scopes: ["https://graph.microsoft.com/.default"],
            });

            this.client = Client.initWithMiddleware({ authProvider });
            return true;
        } catch (error) {
            console.error("Error initializing Microsoft Graph client:", error);
            this.client = null;
            return false;
        }
    }

    public isReady(): boolean {
        return this.client !== null;
    }

    public async validateClientAsync(): Promise<boolean> {
        if(!this.client) {
            throw new Error("Client is not initialized.");
        }
        try {
            // Attempt to get the current user's profile to validate the client
            await this.client.api('/me').get();
            return true;
        } catch (error) {
            console.error("Error validating Microsoft Graph client:", error);
            return false;
        }
    }

    public async getUsersAsync(): Promise<PageCollection> {
        if(!this.client) {
            throw new Error("Client is not initialized.");
        }

        return this.client.api('/users/')
        .select(['displayName', 'id', 'mail'])
        .top(25)
        .orderby('displayName')
        .get();
    }
    
    public async getCalandarEventsAsync(userId : string): Promise<PageCollection> {
        if(!this.client) {
            throw new Error("Client is not initialized.");
        }

        return this.client.api(`/users/${userId}/calendar/events`)
        .top(25)
        .orderby('start/dateTime')
        .get();
    }
    
    public async getPlacesAsync(): Promise<PageCollection> {
        if(!this.client) {
            throw new Error("Client is not initialized.");
        }

        return this.client.api(`/places/microsoft.graph.room`)
        .get();
    }

}

const graph = new MsGraph();
export default graph;