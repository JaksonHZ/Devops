import { FastifyRequest, FastifyReply } from 'fastify';
import zod from 'zod';
import { makeDeleteCategoryUseCase } from '../../../use-cases/factories/make-deleteCategory-usecase';
export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = zod.object({
    id: zod.string()
  });

  const { id } = bodySchema.parse(request.params);

  try {
    const deleteCategoryUseCase = makeDeleteCategoryUseCase();

    await deleteCategoryUseCase.execute({ id });

    return reply.status(200).send();

  } catch (error) {
    return reply.code(500).send({ message: "error" });
  }
}