import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { GetListsUseCase } from "../user/getLists-usecase";
export function makeGetListUseCase() {
  const usersRepository = new PrismaUserRepository();
  const getListsUseCase = new GetListsUseCase(usersRepository);

  return getListsUseCase;
};
