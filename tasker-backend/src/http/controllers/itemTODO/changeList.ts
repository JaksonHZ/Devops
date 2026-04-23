import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeChangeListUseCase } from '../../../use-cases/factories/make-changeList-usecase';
import { ResourceNotFound } from '../../../use-cases/errors/list-not-found';
export async function changeList(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    listTODOId: zod.string(),
    items: zod.array(zod.object({
      itemId: zod.string(),
      order: zod.number()
    }))
  });

  const { listTODOId, items } = bodySchema.parse(request.body);

  try {
    
    const changeListUseCase = makeChangeListUseCase();

    await changeListUseCase.execute({ listTODOId, items});

    return reply.status(200).send();

  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}