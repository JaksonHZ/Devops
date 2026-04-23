import { PrismaCategoryTodoRepository } from "../../repositories/prisma/prisma-category-repository";
import { UpdateCategoryUseCase } from "../category/updateCategory-usecase";
export function makeUpdateCategoryUseCase() {
  const categoryTodoRepository = new PrismaCategoryTodoRepository();
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryTodoRepository);

  return updateCategoryUseCase;
};
