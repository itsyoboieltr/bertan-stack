import { api } from '../../app';
import { handleEden } from '../../utils';

export const todoQueryOptions = () => ({
  queryKey: ['todo'],
  queryFn: async () => handleEden(await api.todo.get()),
});
