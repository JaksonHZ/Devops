import { PrismaListTodoRepository } from "../../repositories/prisma/prisma-listTODO-repository";
import { DeleteListUseCase } from "../listTODO/deleteList-usecase";
export function makeDeleteListUseCase() {
  const listTodoRepository = new PrismaListTodoRepository();
  const deleteListUseCase = new DeleteListUseCase(listTodoRepository);

  return deleteListUseCase;
};
