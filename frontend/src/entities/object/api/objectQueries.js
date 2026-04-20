import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getObjects, getObjectById, createObject } from 'shared/api/benuaApi';

export const objectKeys = {
  all: ['objects'],
  detail: (id) => ['objects', id],
};

export const useObjects = () =>
  useQuery({
    queryKey: objectKeys.all,
    queryFn: getObjects,
  });

export const useObjectById = (id) =>
  useQuery({
    queryKey: objectKeys.detail(id),
    queryFn: () => getObjectById(id),
    enabled: !!id,
  });

export const useCreateObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createObject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objectKeys.all });
    },
  });
};
