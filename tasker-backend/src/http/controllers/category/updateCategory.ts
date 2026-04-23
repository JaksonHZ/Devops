import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeUpdateCategoryUseCase } from '../../../use-cases/factories/make-updateCategory-usecase';

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    color: zod.string(),
    name: zod.string(),
    id: zod.string()
  });

  const { color, name } = bodySchema.parse(request.body);
  const { id } = bodySchema.parse(request.params);

  try {
    const updateCategoryUseCase = makeUpdateCategoryUseCase();

    await updateCategoryUseCase.execute({color, name, id });

    return reply.status(200).send();

  } catch (error) {
    return reply.code(500).send({ message: "error" });
  }
}