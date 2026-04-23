import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeGetCategoryUseCase } from '../../../use-cases/factories/make-getCategory-usecase';

export async function getCategory(request: FastifyRequest, reply: FastifyReply) {

  try {
    const getCategoryUseCase = makeGetCategoryUseCase();

    const category = await getCategoryUseCase.execute({ userId: request.user.sub });

    return reply.status(200).send({ category });

  } catch (error) {
    return reply.code(500).send({ message: "error" });
  }
}