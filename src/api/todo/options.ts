import { api } from '../../app';

export const todoQueryOptions = () => ({
  queryKey: ['todo'],
  queryFn: async () => (await api.todo.get()).data!,
});
