import { PrismaListTodoRepository } from "../../repositories/prisma/prisma-listTODO-repository";
import { CreateListUseCase } from "../listTODO/createList-usecase";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
export function makeCreateListUseCase() {
  const listTodoRepository = new PrismaListTodoRepository();
  const userRepository = new PrismaUserRepository
  const createListUseCase = new CreateListUseCase(listTodoRepository, userRepository);

  return createListUseCase;
};
