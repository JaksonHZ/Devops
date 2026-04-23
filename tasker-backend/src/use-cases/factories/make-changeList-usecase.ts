import { PrismaItemTodoRepository } from "../../repositories/prisma/prisma-itemTODO-repository";
import { ChangeListUseCase } from "../itemTODO/changeList-usecase";
export function makeChangeListUseCase() {
  const itemTodoRepository = new PrismaItemTodoRepository();
  const changeListUseCase = new ChangeListUseCase(itemTodoRepository);

  return changeListUseCase;
};
