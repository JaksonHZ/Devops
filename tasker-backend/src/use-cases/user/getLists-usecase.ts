import { ListTODO } from "@prisma/client";
import { ListTodoRepository } from "../../repositories/listTODO-repository";
import { UserRepository } from "../../repositories/users-repository";

interface GetListsUseCaseRequest {
  userId: string;
}

interface GetListsUseCaseResponse {
  lists: ListTODO[];
}

export class GetListsUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute({userId}: GetListsUseCaseRequest): Promise<GetListsUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const lists = await this.userRepository.findLists(userId);

    return {
      lists
    }
  }
}