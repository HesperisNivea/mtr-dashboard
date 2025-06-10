
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types.js';


export const actions = {
  login: async ({ request }) => {

    console.log('Login action triggered');
    const formData = await request.formData();

    const clientId = formData.get('clientId') as string;
    const clientSecret = formData.get('clientSecret') as string;
    const tenantId = formData.get('tenantId') as string;

    if (!clientId || !clientSecret || !tenantId) {
      return fail(400, {
        error: 'All fields are required. Please provide Client ID, Client Secret, and Tenant ID.'
      });
      };
    
    try {
      const response = await fetch('http://localhost:5173/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          tenantId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return fail(response.status, {error: data.error || 'Failed to fetch token.'});
      }
      // If everything is successful, return success
      return { success: true};
      
    } catch (error) {
      return { success: false, error: 'Internal server error' + error };
    }
  },
} satisfies Actions;


