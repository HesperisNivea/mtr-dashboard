import { json } from '@sveltejs/kit';
import { saveConfig } from '$lib/server/tokenManager.js';
import graph from '$lib/server/MsGraph.js';
import type { AppConfig } from '../../../types/config.js';


export const POST = async ({ request } : {request : Request}) => {
    const data : AppConfig = await request.json();

    try {
        
        // Basic validation
        if (!data.clientId || !data.clientSecret || !data.tenantId || !data.userId) {
            return json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }
        
        // Save config
        saveConfig({
            clientId: data.clientId,
            clientSecret: data.clientSecret,
            tenantId: data.tenantId,
            userId: data.userId
        });
        
        // Test the configuration
        const initialized = await graph.initializeClient();
        if (!initialized) {
            return json({ 
                success: false, 
                error: 'Failed to initialize Graph client with provided credentials' 
            }, { status: 400 });
        }
        
        return json({ success: true });
    } catch (error) {
        console.error('Setup error:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}