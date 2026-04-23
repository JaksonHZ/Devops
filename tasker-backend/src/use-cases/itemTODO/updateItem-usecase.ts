import { ItemTodoRepository } from "../../repositories/itemTODO-repository";
import { ResourceNotFound } from "../errors/list-not-found";
interface updateItemUseCaseRequest {
  id: string, 
  title?: string,
  description?: string, 
  categoryId?: string
  done?: boolean,
  order?: number
}

export class UpdateItemUseCase {
  constructor(
    private itemTODORepository: ItemTodoRepository,
  ){}

  async execute({id, title, categoryId, description, done, order}: updateItemUseCaseRequest) {

    const itemTODO = await this.itemTODORepository.findById(id);

    if (!itemTODO) {
      throw new ResourceNotFound();
    }

    await this.itemTODORepository.update(id, title, description, categoryId, done, order);

    return;
  }
}