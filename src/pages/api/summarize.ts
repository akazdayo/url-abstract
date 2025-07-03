import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    if (!body) {
      return new Response(JSON.stringify({ error: 'Request body is empty' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const { url } = JSON.parse(body);
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Fetch the content from the URL
    const urlResponse = await fetch(url);
    if (!urlResponse.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch URL: ${urlResponse.status}` }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const urlContent = await urlResponse.text();
    
    // Return the content to the client
    return new Response(JSON.stringify({ 
      content: urlContent.slice(0, 10000) // Limit content size
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error in fetch API:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};