import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeUpdateOrderListUseCase } from '../../../use-cases/factories/make-updateOrderList-usecase';
import { ResourceNotFound } from '../../../use-cases/errors/list-not-found';
export async function updateOrderList(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    orderNumber: zod.number(),
    id: zod.string(),
  });

  const { orderNumber, id } = bodySchema.parse(request.body);

  try {
    const updateOrderListUseCase = makeUpdateOrderListUseCase();

    await updateOrderListUseCase.execute({ orderNumber, id });

    return reply.status(200).send();

  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.code(404).send({ message: error.message });
    }

    throw error;
  }
}