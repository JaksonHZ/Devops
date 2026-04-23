import * as z from 'zod'
import "dotenv/config"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  SECRET_JWT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variable', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;