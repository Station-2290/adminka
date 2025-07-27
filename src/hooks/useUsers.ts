import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/shared/api';

export function useUsers(page = 1, limit = 10) {
  return $api.useQuery('get', '/api/users', {
    params: {
      query: { page, limit }
    }
  });
}

export function useUser(id: number) {
  return $api.useQuery('get', '/api/users/{id}', {
    params: {
      path: { id }
    }
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/users', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/users/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('delete', '/api/users/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/users'] });
    },
  });
}

export function useCurrentUser() {
  return $api.useQuery('get', '/api/users/me');
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/users/me', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/users/me'] });
    },
  });
}

export function useChangePassword() {
  return $api.useMutation('post', '/api/users/me/change-password');
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('patch', '/api/users/{id}/role', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/users'] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  
  return $api.useMutation('post', '/api/users/{id}/toggle-status', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/users'] });
    },
  });
}