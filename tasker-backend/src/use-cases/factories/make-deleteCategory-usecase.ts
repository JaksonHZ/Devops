import { PrismaCategoryTodoRepository } from "../../repositories/prisma/prisma-category-repository";
import { DeleteCategoryUseCase } from "../category/deleteCategory-usecase";
export function makeDeleteCategoryUseCase() {
  const categoryTodoRepository = new PrismaCategoryTodoRepository();
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryTodoRepository);

  return deleteCategoryUseCase;
};
