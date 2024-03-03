import { Type as t } from '@sinclair/typebox/type';
import { parse } from '../../';

const clientEnvSchema = t.Object({
  API_URL: t.String({
    minLength: 1,
    error: 'CLIENT_API_URL client environment variable is not set!',
  }),
});

export const clientEnv = parse(clientEnvSchema, {
  API_URL: Bun.env.CLIENT_API_URL || 'http://localhost:3000',
});
