import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/shared/api';

export function useApiKeys() {
  return $api.useQuery('get', '/api/api-keys');
}

export function useApiKey(id: number) {
  return $api.useQuery('get', '/api/api-keys/{id}', {
    params: {
      path: { id }
    }
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/api-keys', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/api-keys'] });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/api-keys/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/api-keys'] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('delete', '/api/api-keys/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/api-keys'] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/api-keys/{id}/revoke', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/api-keys'] });
    },
  });
}