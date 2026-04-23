import { PrismaListTodoRepository } from "../../repositories/prisma/prisma-listTODO-repository";
import { UpdateListUseCase } from "../listTODO/updateList-usecase";
export function makeUpdateListUseCase() {
  const listTodoRepository = new PrismaListTodoRepository();
  const updateListUseCase = new UpdateListUseCase(listTodoRepository);

  return updateListUseCase;
};
