import { PrismaCategoryTodoRepository } from "../../repositories/prisma/prisma-category-repository";
import { CreateCategoryUseCase } from "../category/createCategory-usecase";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
export function makeCreateCategoryUseCase() {
  const categoryTodoRepository = new PrismaCategoryTodoRepository();
  const userRepository = new PrismaUserRepository
  const createCategoryUseCase = new CreateCategoryUseCase(userRepository, categoryTodoRepository);

  return createCategoryUseCase;
};
