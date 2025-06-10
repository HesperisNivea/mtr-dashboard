
import type { Actions } from './$types.js';


export const actions = {
  login: async ({ request }) => {
    const formData = await request.formData();

    const clientId = formData.get('clientId') as string;
    const clientSecret = formData.get('clientSecret') as string;
    const tenantId = formData.get('tenantId') as string;

    if (!clientId || !clientSecret || !tenantId) {
      return { success: false, error: 'All fields are required.' };
    }

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
        return { success: false, error: data.error || 'Failed to initialize Graph client.' };
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Invalid credentials or insufficient permissions.' };
      }

      // If everything is successful, return success
      return { success: true};
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Internal server error' };
    }
  },
} satisfies Actions;


