import { ListTodoRepository } from "../listTODO-repository";
import { prisma } from "../../lib/prisma";

export class PrismaListTodoRepository implements ListTodoRepository {
  async create(title: string, userId: string, orderNumber: number) {
    const list = await prisma.listTODO.create({
      data: {
        title,
        userId,
        done: true,
        orderNumber,
      }
    })

    return list;
  }

  async findById(id: string) {
    const list = await prisma.listTODO.findUnique({
      where: {
        id
      }
    })

    return list;
  }

  async delete(id: string) {
    await prisma.listTODO.delete({
      where: {
        id
      }
    })
  }

  async update(id: string, title: string) {
    const list = await prisma.listTODO.update({
      where: {
        id
      },
      data: {
        title
      }
    })

    return list;
  }

  async updateOrderNumber(id: string, orderNumber: number){
    const list = await prisma.listTODO.update({
      where: {
        id
      },
      data: {
        orderNumber
      }
    })

    return list;
  }

}