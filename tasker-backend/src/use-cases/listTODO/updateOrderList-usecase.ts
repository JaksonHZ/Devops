import { ListTodoRepository } from "../../repositories/listTODO-repository";
import { UserRepository } from "../../repositories/users-repository";
import { ResourceNotFound } from "../errors/list-not-found";

interface UpdateOrderListUseCaseRequest {
  id: string;
  orderNumber: number;
}

export class UpdateOrderListUseCase {
  constructor(
    private listTODORepository: ListTodoRepository,
  ){}

  async execute({id, orderNumber}: UpdateOrderListUseCaseRequest) {

    const list = await this.listTODORepository.findById(id)

    if (!list) {
      throw new ResourceNotFound();
    }

    await this.listTODORepository.updateOrderNumber(id, orderNumber);

    return;
  }
}