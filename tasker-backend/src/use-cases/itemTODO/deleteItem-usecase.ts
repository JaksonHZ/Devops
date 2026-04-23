import { ItemTodoRepository } from "../../repositories/itemTODO-repository";
import { ResourceNotFound } from "../errors/list-not-found";

interface deleteItemUseCaseRequest {
  id: string, 
}

export class DeleteItemUseCase {
  constructor(
    private itemTODORepository: ItemTodoRepository,
  ){}

  async execute({id}: deleteItemUseCaseRequest) {

    const itemTODO = await this.itemTODORepository.findById(id);

    if (!itemTODO) {
      throw new ResourceNotFound();
    }


    await this.itemTODORepository.delete(id);

    return;
  }
}