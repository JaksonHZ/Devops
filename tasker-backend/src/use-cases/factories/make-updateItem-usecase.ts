import { PrismaItemTodoRepository } from "../../repositories/prisma/prisma-itemTODO-repository";
import { UpdateItemUseCase } from "../itemTODO/updateItem-usecase";
export function makeUpdateItemUseCase() {
  const itemTodoRepository = new PrismaItemTodoRepository();
  const updateItemUseCase = new UpdateItemUseCase(itemTodoRepository);

  return updateItemUseCase;
};
