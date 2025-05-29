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

        // const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        // // The client credentials flow requires that you request the
        // // /.default scope, and pre-configure your permissions on the
        // // app registration in Azure. An administrator must grant consent
        // // to those permissions beforehand.
        //     scopes: ["https://graph.microsoft.com/.default"],
        // });

        // this.client = Client.initWithMiddleware({ authProvider });
    
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
    
    public async getCalandarEventsAsync(): Promise<PageCollection> {
        if(!this.client) {
            throw new Error("Client is not initialized.");
        }

        const config = getConfig();
        return this.client.api(`/users/${config.userId}/calendar/events`)
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

const graph = Object.freeze(new MsGraph());
export default graph;