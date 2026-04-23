import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeRegisterUseCase } from '../../../use-cases/factories/make-register-usecase';
import { UserAlreadyExistError } from '../../../use-cases/errors/user-already-exists';

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    email: zod.string().email(),
    username: zod.string().min(3),
    password: zod.string().min(6),
  });

  const { email, username, password } = bodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ email, username, password });

    return reply.status(201).send();

  } catch (error) {
    if(error instanceof UserAlreadyExistError) {
      return reply.code(409).send({ message: error.message });
    }

    throw error;
  }
}