import { CategoryTodoRepository } from "../../repositories/category-repository";

interface updateCategoryUseCaseRequest {
  id: string,
  name: string,
  color: string
}

export class UpdateCategoryUseCase {
  constructor(
    private categoryTODORepository: CategoryTodoRepository
  ){}

  async execute({id, name, color}: updateCategoryUseCaseRequest) {

    await this.categoryTODORepository.update(id, name, color);

    return;
  }
}