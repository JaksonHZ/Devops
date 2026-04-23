import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeCreateCategoryUseCase } from '../../../use-cases/factories/make-createCategory-usecase';

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    color: zod.string(),
    name: zod.string(),
  });

  const { color, name } = bodySchema.parse(request.body);

  try {
    const createCategoryUseCase = makeCreateCategoryUseCase();

    await createCategoryUseCase.execute({ color, name, userId: request.user.sub });

    return reply.status(201).send();

  } catch (error) {
    return reply.code(500).send({ message: "error" });
  }
}