import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "@/__generated__/api/index";
import { env } from "@/env";
import { tokenStorage } from "@/shared/auth/storage";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const fetchClient = createFetchClient<paths>({
  baseUrl: env.VITE_API_URL,
  credentials: "include", // Important for HTTP-only cookies
});

// Add auth interceptor for requests
fetchClient.use({
  onRequest({ request }) {
    const token = tokenStorage.getAccessToken();
    if (token && !isAuthEndpoint(request.url)) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  
  async onResponse({ request, response }) {
    // Handle token refresh on 401 for non-auth endpoints
    if (response.status === 401 && !isAuthEndpoint(request.url)) {
      const token = tokenStorage.getAccessToken();
      
      // Only attempt refresh if we had a token and it's not a refresh endpoint
      if (token && !request.url.includes('/auth/refresh')) {
        const refreshed = await handleTokenRefresh();
        
        if (refreshed) {
          // Retry the original request with new token
          const newToken = tokenStorage.getAccessToken();
          if (newToken) {
            request.headers.set("Authorization", `Bearer ${newToken}`);
            return fetch(request);
          }
        } else {
          // Refresh failed, trigger logout
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      }
    }
    return response;
  }
});

// Helper function to check if URL is an auth endpoint
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/login') || 
         url.includes('/auth/register') || 
         url.includes('/auth/refresh');
}

// Handle token refresh with proper concurrency control
async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performTokenRefresh();
  
  try {
    const result = await refreshPromise;
    return result;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

// Perform the actual token refresh
async function performTokenRefresh(): Promise<boolean> {
  try {
    console.debug('Attempting to refresh access token...');
    const response = await fetch(`${env.VITE_API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // This sends the HTTP-only refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        tokenStorage.setAccessToken(data.access_token);
        console.debug('Token refresh successful');
        // Dispatch event to update auth context
        window.dispatchEvent(new CustomEvent('auth:token-refreshed', {
          detail: { user: data.user, access_token: data.access_token }
        }));
        return true;
      }
    } else {
      console.warn('Token refresh failed with status:', response.status);
      // Clear any existing token on refresh failure
      tokenStorage.clear();
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    tokenStorage.clear();
    return false;
  }
}

const $api = createClient(fetchClient);

// Export both the react-query client and raw fetch client
export { fetchClient };
export default $api;