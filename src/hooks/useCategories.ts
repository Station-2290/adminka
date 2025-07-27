import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/shared/api';

export function useCategories(page = 1, limit = 50) {
  return $api.useQuery('get', '/api/v1/categories', {
    params: {
      query: { page, limit }
    }
  });
}

export function useCategory(id: number) {
  return $api.useQuery('get', '/api/v1/categories/{id}', {
    params: {
      path: { id }
    }
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/v1/categories', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/v1/categories/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('delete', '/api/v1/categories/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/categories'] });
    },
  });
}