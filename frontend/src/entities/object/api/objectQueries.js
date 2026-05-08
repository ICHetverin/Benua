import { useQuery } from '@tanstack/react-query';
import { getObjects, getObjectById } from 'shared/api/benuaApi';

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
