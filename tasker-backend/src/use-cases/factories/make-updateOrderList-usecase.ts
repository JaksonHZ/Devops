import { PrismaListTodoRepository } from "../../repositories/prisma/prisma-listTODO-repository";
import { UpdateOrderListUseCase } from "../listTODO/updateOrderList-usecase";
export function makeUpdateOrderListUseCase() {
  const listTodoRepository = new PrismaListTodoRepository();
  const updateOrderListUseCase = new UpdateOrderListUseCase(listTodoRepository);

  return updateOrderListUseCase;
};
