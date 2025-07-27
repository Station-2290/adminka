import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/shared/api';

export function useProducts(page = 1, limit = 10) {
  return $api.useQuery('get', '/api/v1/products', {
    params: {
      query: { page, limit }
    }
  });
}

export function useProduct(id: number) {
  return $api.useQuery('get', '/api/v1/products/{id}', {
    params: {
      path: { id }
    }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/v1/products', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/v1/products/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('delete', '/api/v1/products/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/products'] });
    },
  });
}