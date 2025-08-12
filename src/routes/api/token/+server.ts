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
        
        // Use centralized tenant connection validation
        const connectionResult = await graph.ensureTenantConnection();
        if (!connectionResult.success) {
            return error(400, connectionResult.error || 'Failed to validate credentials');
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