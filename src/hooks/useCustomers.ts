import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/shared/api';

export function useCustomers(page = 1, limit = 10) {
  return $api.useQuery('get', '/api/v1/customers', {
    params: {
      query: { page, limit }
    }
  });
}

export function useCustomer(id: number) {
  return $api.useQuery('get', '/api/v1/customers/{id}', {
    params: {
      path: { id }
    }
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/v1/customers', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/v1/customers/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/customers'] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('delete', '/api/v1/customers/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/customers'] });
    },
  });
}