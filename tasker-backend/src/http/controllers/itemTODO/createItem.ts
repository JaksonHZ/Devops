import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeCreateItemUseCase } from '../../../use-cases/factories/make-createItem-usecase';
import { ResourceNotFound } from '../../../use-cases/errors/list-not-found';
export async function createItem(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    title: zod.string(),
    listTODOId: zod.string(),
    order: zod.number(),
    description: zod.string().optional(), 
    categoryId: zod.string().optional()
  });

  const { title, listTODOId, order, description, categoryId } = bodySchema.parse(request.body);

  try {
    const createItemUseCase = makeCreateItemUseCase();

    await createItemUseCase.execute({ title, listTODOId, order, description, categoryId});

    return reply.status(201).send();

  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}