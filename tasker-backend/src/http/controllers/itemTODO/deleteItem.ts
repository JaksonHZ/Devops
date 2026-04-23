import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeDeleteItemUseCase } from '../../../use-cases/factories/make-deleteItem-usecase';
import { ResourceNotFound } from '../../../use-cases/errors/list-not-found';
export async function deleteItem(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    id: zod.string(),
  });

  const { id } = bodySchema.parse(request.params);

  try {
    const deleteItemUseCase = makeDeleteItemUseCase();

    await deleteItemUseCase.execute({ id });

    return reply.status(200).send();

  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}