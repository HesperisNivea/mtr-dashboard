import { json } from '@sveltejs/kit';
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
            return json({ 
                success: false, 
                error: 'Failed to initialize Graph client with provided credentials' 
            }, { status: 400 });
        }
        
        //Test the configuration
        const isValid = await graph.validateClientAsync();
        if (!isValid) {
            return json({ 
                success: false, 
                error: 'Invalid credentials or insufficient permissions' 
            }, { status: 400 });
        }
        
        if(!graph.isReady()) {
            return json({
                success: false,
                error: 'Graph client is not ready. Please check your configuration.'
            }, { status: 400 });
        }
        // If everything is successful, return success
        return json({ success: true });
    } catch (error) {
        console.error('Setup error:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}