import { PrismaListTodoRepository } from "../../repositories/prisma/prisma-listTODO-repository";
import { PrismaItemTodoRepository } from "../../repositories/prisma/prisma-itemTODO-repository";
import { CreateItemUseCase } from "../itemTODO/createItem-usecase";
export function makeCreateItemUseCase() {
  const listTodoRepository = new PrismaListTodoRepository();
  const itemTodoRepository = new PrismaItemTodoRepository();
  const createItemUseCase = new CreateItemUseCase(itemTodoRepository, listTodoRepository);

  return createItemUseCase;
};
