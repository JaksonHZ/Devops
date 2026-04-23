import { ItemTodoRepository } from "../../repositories/itemTODO-repository";

interface changeListUseCaseRequest {
  listTODOId: string,
  items: {
    itemId: string,
    order: number
  }[]
}

export class ChangeListUseCase {
  constructor(
    private itemTODORepository: ItemTodoRepository,
  ){}

  async execute({items, listTODOId}: changeListUseCaseRequest) {

    for(let item of items){
      await this.itemTODORepository.changeList(item.itemId, listTODOId, item.order)
    }

    return;
  }
}