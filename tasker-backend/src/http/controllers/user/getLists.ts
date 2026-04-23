import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeGetListUseCase } from '../../../use-cases/factories/make-getList-usecase';

export async function getLists(request: FastifyRequest, reply: FastifyReply) {

  try {
    const getListsUseCase = makeGetListUseCase();

    const { lists } = await getListsUseCase.execute({ userId: request.user.sub});

    return reply.status(200).send({
      lists
    });

  } catch (error) {
    return reply.code(404).send({ message: "error" });
  }
}