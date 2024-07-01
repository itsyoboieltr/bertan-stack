import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { validate } from '../utils';
import { api } from '../app';
import { Create } from '@sinclair/typebox/value';
import Todo from '../components/Todo';
import { todoInsertSchema } from '../api/todo/schema';
import { todoQueryOptions } from '../api/todo/options';

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(todoQueryOptions()),
  component: () => {
    const [todo, setTodo] = useState(Create(todoInsertSchema));

    const todoQuery = useQuery(todoQueryOptions());

    const todoAdd = useMutation({
      mutationFn: async () => await api.todo.post(todo),
      onSuccess: () => setTodo(Create(todoInsertSchema)),
    });

    return (
      <div className={'mx-auto p-4 text-center text-gray-700'}>
        {todoQuery.data?.map((todo) => (
          <div key={todo.id} className={'mb-2'}>
            <Todo id={todo.id} data={todo.data} />
          </div>
        ))}
        <br />
        <div className={'flex flex-row justify-center gap-4'}>
          <input
            className={'rounded border-2 border-black py-1 px-2'}
            type={'text'}
            value={todo.data}
            onInput={({ currentTarget: { value: data } }) => setTodo({ data })}
            onKeyUp={({ key }) => {
              if (
                key === 'Enter' &&
                !todoAdd.isPending &&
                validate(todoInsertSchema, todo)
              )
                todoAdd.mutate();
            }}
          />
          <button
            className={
              'rounded border-2 border-black bg-gray-300 px-4 transition-all hover:bg-gray-400 active:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-400'
            }
            disabled={todoAdd.isPending || !validate(todoInsertSchema, todo)}
            onClick={() => todoAdd.mutate()}>
            Submit
          </button>
        </div>
        <br />
        <pre>Bun + Elysia + React + TanStack Router</pre>
      </div>
    );
  },
});
