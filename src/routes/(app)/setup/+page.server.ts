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
    

    // try to log in to ms graph api
    // Save the configuration
    // if login fails, return an error
    //else redirect to the dashboard

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          tenantId
        })
      });

      const result = await response.json();

        if (!result.success) {
          return { success: false, error: result.error || 'Failed to save configuration.' };
        }

      // If the response is successful, redirect to the dashboard
      if (result.success) {
        return { success: true, redirect: '/' };
      } else {
        return { success: false, error: result.error || 'Login failed.' };
      }


      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Internal server error' };
      }

    return { success: true };
  }  } satisfies Actions;


