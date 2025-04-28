import "isomorphic-fetch";

import { ClientSecretCredential } from "@azure/identity";
import { Client, type PageCollection } from "@microsoft/microsoft-graph-client";
// prettier-ignore
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";

import {YOUR_CLIENT_ID_HERE,
    YOUR_CLIENT_SECRET_HERE,
    YOUR_TENANT_ID_HERE,
    CLIENT_ID}
    from  "$env/static/private"

    class MsGraph {
    private client: Client;

    constructor() {
        const credential = new ClientSecretCredential(
            YOUR_TENANT_ID_HERE,
            YOUR_CLIENT_ID_HERE,
            YOUR_CLIENT_SECRET_HERE
        );

        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        // The client credentials flow requires that you request the
        // /.default scope, and pre-configure your permissions on the
        // app registration in Azure. An administrator must grant consent
        // to those permissions beforehand.
            scopes: ["https://graph.microsoft.com/.default"],
        });

        this.client = Client.initWithMiddleware({ authProvider });
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

        return this.client.api(`/users/${CLIENT_ID}/calendar/events`)
        .top(25)
        .orderby('start/dateTime')
        .get();
    }

    //401 Unauthorized error when trying to get places
    // public async getPlacesAsync(): Promise<PageCollection> {
    //     if(!this.client) {
    //         throw new Error("Client is not initialized.");
    //     }

    //     return this.client.api(`/places`)
    //     .get();
    // }
}

const graph = Object.freeze(new MsGraph());
export default graph;