import { useQuery } from '@tanstack/react-query';
import { getPersons, getPersonById } from 'shared/api/benuaApi';

export const personKeys = {
  all: ['persons'],
  detail: (id) => ['persons', id],
};

export const usePersons = (search = '') =>
  useQuery({
    queryKey: [...personKeys.all, search],
    queryFn: () => getPersons(search),
  });

export const usePersonById = (id) =>
  useQuery({
    queryKey: personKeys.detail(id),
    queryFn: () => getPersonById(id),
    enabled: !!id,
  });
