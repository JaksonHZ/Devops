import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeUpdateItemUseCase } from '../../../use-cases/factories/make-updateItem-usecase';
import { ResourceNotFound } from '../../../use-cases/errors/list-not-found';
export async function updateItem(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(), 
    categoryId: zod.string().optional(),
    done: zod.boolean().optional(),
    order: zod.number().optional(),
  });

  const paramsSchema = zod.object({
    id: zod.string(),
  })

  const { id } = paramsSchema.parse(request.params);
  const { title, categoryId, description, done, order } = bodySchema.parse(request.body);

  try {
    const updateItemUseCase = makeUpdateItemUseCase();

    await updateItemUseCase.execute({ id, title, categoryId, description, done, order});

    return reply.status(200).send();

  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}