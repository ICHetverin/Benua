import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPersons, getPersonById, createPerson } from 'shared/api/benuaApi';

export const personKeys = {
  all: ['persons'],
  detail: (id) => ['persons', id],
};

export const usePersons = () =>
  useQuery({
    queryKey: personKeys.all,
    queryFn: getPersons,
  });

export const usePersonById = (id) =>
  useQuery({
    queryKey: personKeys.detail(id),
    queryFn: () => getPersonById(id),
    enabled: !!id,
  });

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all });
    },
  });
};
