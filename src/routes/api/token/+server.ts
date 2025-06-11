import { error, json } from '@sveltejs/kit';
import { saveConfig } from '$lib/server/tokenManager.js';
import graph from '$lib/server/MsGraph.js';
import type { AppConfig } from '../../../types/config.js';


export const POST = async ({ request } : {request : Request}) => {
    const data : AppConfig = await request.json();

    try {
        // Save config
        saveConfig({
            clientId: data.clientId,
            clientSecret: data.clientSecret,
            tenantId: data.tenantId,
        });
        
        // Initialize the Graph client
        const initialized = await graph.initializeClient();
        if (!initialized) {
            return error(  400, 'Failed to initialize Graph client with provided credentials');
            } ;
        
        //Test the configuration
        if (!await graph.validateClientAsync()) {
            return error(400, 'Invalid credentials or insufficient permissions' );
        }
        
        if(!graph.isReady()) {
            return error(400, 'Graph client is not ready. Please check your configuration.');
        }
        
        return json({ success: true });
    } catch (err) {
        console.error('Setup error:', err);
        return error(500, 'An error occurred during setup. Please check your configuration and try again.');
    }
}