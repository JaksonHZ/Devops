import { CategoryTodoRepository } from "../../repositories/category-repository";
import { UserRepository } from "../../repositories/users-repository";

interface createItemUseCaseRequest {
  name: string,
  userId: string,
  color: string
}

export class CreateCategoryUseCase {
  constructor(
    private userTODORepository: UserRepository,
    private categoryTODORepository: CategoryTodoRepository
  ){}

  async execute({color, name, userId}: createItemUseCaseRequest) {
    const user = await this.userTODORepository.findById(userId);

    if (!user) {
      throw new Error('user not found');
    }

    await this.categoryTODORepository.create(name, userId, color);

    return;
  }
}