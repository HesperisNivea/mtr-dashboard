import { json } from '@sveltejs/kit';
import { saveConfig } from '$lib/server/tokenManager.js';
import graph from '$lib/server/MsGraph.js';

export async function POST({ request }: { request: Request }) {
    try {
        const data = await request.json();
        
        // Basic validation
        if (!data.clientId || !data.clientSecret || !data.tenantId) {
            return json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }
        
        //Save config
        saveConfig({
            clientId: data.clientId,
            clientSecret: data.clientSecret,
            tenantId: data.tenantId,
        });
        
        // Use centralized tenant connection validation
        const connectionResult = await graph.ensureTenantConnection();
        if (!connectionResult.success) {
            return json({ 
                success: false, 
                error: connectionResult.error || 'Failed to validate credentials' 
            }, { status: 400 });
        }
        
        return json({ success: true });
    } catch (error) {
        console.error('Setup error:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}