import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from './api';
import type { UserCreateDto, UserUpdateDto } from './types';

const userKeys = {
  all: ['users'] as const,
};

export const useUsers = () =>
  useQuery({ queryKey: userKeys.all, queryFn: userApi.list });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UserCreateDto) => userApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UserUpdateDto }) => userApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
};
