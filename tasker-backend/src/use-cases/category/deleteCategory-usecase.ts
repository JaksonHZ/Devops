import { CategoryTodoRepository } from "../../repositories/category-repository";

interface deleteCategoryUseCaseRequest {
  id: string,
}

export class DeleteCategoryUseCase {
  constructor(
    private categoryTODORepository: CategoryTodoRepository
  ){}

  async execute({ id }: deleteCategoryUseCaseRequest) {

    await this.categoryTODORepository.delete(id);

    return;
  }
}