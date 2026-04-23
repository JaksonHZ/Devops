import { GetCategoryUseCase } from "../user/getCategory-usecase";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
export function makeGetCategoryUseCase() {
  const userRepository = new PrismaUserRepository
  const getCategoryUseCase = new GetCategoryUseCase(userRepository);

  return getCategoryUseCase;
};
