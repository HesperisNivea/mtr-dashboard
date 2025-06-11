import { fail } from '@sveltejs/kit';
import type { Actions } from './$types.js';


export const actions = {
  login: async ({ request }) => {

    console.log('Login action triggered');
    const formData = await request.formData();

    const clientId = formData.get('clientId') as string;
    const clientSecret = formData.get('clientSecret') as string;
    const tenantId = formData.get('tenantId') as string;
    const errors = {
      global: undefined as string | undefined,
      clientId: undefined as string | undefined,
      clientSecret: undefined as string | undefined,
      tenantId: undefined as string | undefined,
    };
    if(!clientId)
    {
      errors.clientId = 'Client ID is required.';
    }

    if(!clientSecret)
    {
      errors.clientSecret = 'Client Secret is required.'; 
    }
    if(!tenantId)
    {
      errors.tenantId = 'Tenant ID is required.';
    }



    if (!clientId || !clientSecret || !tenantId) {
      return fail(400, {
         errors: {
          clientId : errors.clientId,
          clientSecret : errors.clientSecret,
          tenantId : errors.tenantId,
          global : "All fields are required"
        }
      });
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
        console.log('Response not ok:', data);
        return fail(500, {
          errors: {
            clientId : errors.clientId,
            clientSecret : errors.clientSecret,
            tenantId : errors.tenantId,
            global: data.message || 'An error occurred while processing your request. Please try again later.'
          }
        });
      }

      return { success: true };

    } catch (err) {
      if (err instanceof Error) {
        return {
          errors: {
            clientId : errors.clientId,
            clientSecret : errors.clientSecret,
            tenantId : errors.tenantId,
            global: err instanceof Error ? err.message : 'An error occurred while processing your request. Please try again later.',
          }
        };
      } else {
        return {
          error: 'An unknown error occurred.',
        };
      }
    }
  },
} satisfies Actions;


