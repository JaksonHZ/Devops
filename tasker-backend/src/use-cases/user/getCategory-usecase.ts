import { UserRepository } from "../../repositories/users-repository";

interface getCategoryUseCaseRequest {
  userId: string,
}

export class GetCategoryUseCase {
  constructor(
    private userTODORepository: UserRepository,
  ){}

  async execute({userId}: getCategoryUseCaseRequest) {
    const user = await this.userTODORepository.findById(userId);

    if (!user) {
      throw new Error('user not found');
    }

    const category = await this.userTODORepository.findCategories(userId);

    return category;
  }
}