import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/shared/api';

export function useOrders(page = 1, limit = 10, status?: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED") {
  return $api.useQuery('get', '/api/v1/orders', {
    params: {
      query: { page, limit, ...(status && { status }) }
    }
  });
}

export function useOrder(id: number) {
  return $api.useQuery('get', '/api/v1/orders/{id}', {
    params: {
      path: { id }
    }
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/v1/orders', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/v1/orders/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/orders'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/v1/orders/{id}/cancel', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/orders'] });
    },
  });
}