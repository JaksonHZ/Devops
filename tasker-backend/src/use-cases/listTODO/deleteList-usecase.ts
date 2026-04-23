import { ListTodoRepository } from "../../repositories/listTODO-repository";
import { ResourceNotFound } from "../errors/list-not-found";
interface DeleteListUseCaseRequest {
  id: string;
}

export class DeleteListUseCase {
  constructor(
    private listTODORepository: ListTodoRepository,
  ){}

  async execute({id}: DeleteListUseCaseRequest) {

    const list = await this.listTODORepository.findById(id)

    if (!list) {
      throw new ResourceNotFound();
    }

    await this.listTODORepository.delete(id)

    return;
  }
}