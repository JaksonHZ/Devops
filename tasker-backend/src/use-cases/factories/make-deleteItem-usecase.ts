import { PrismaItemTodoRepository } from "../../repositories/prisma/prisma-itemTODO-repository";
import { DeleteItemUseCase } from "../itemTODO/deleteItem-usecase";
export function makeDeleteItemUseCase() {
  const itemTodoRepository = new PrismaItemTodoRepository();
  const deleteItemUseCase = new DeleteItemUseCase(itemTodoRepository);

  return deleteItemUseCase;
};
