import { ItemTodoRepository } from "../itemTODO-repository";
import { prisma } from "../../lib/prisma";

export class PrismaItemTodoRepository implements ItemTodoRepository {
  
  async create(title: string, listTODOId: string, order: number, description?: string | undefined, categoryId?: string | undefined){
    const itemTODO = await prisma.itemTODO.create({
      data: {
        title,
        listTODOId,
        order,
        description,
        done: false,
        categoryId
      }
    });

    return itemTODO;
  }

  async findById(id: string){
    const itemTODO = await prisma.itemTODO.findUnique({
      where: {
        id
      }
    })

    return itemTODO;
  }

  async update(id: string, title?: string, description?: string, categoryId?: string, done?: boolean, order?: number){
    const itemTODO = await prisma.itemTODO.update({
      where: {
        id
      },
      data: {
        title,
        description,
        categoryId,
        done,
        order
      }
    });

    return itemTODO;
  }
  async changeList(id: string, listTODOId: string, order: number){
    const itemTODO = await prisma.itemTODO.update({
      where: {
        id
      },
      data: {
        listTODOId,
        order
      }
    });
    return itemTODO;
  }
  async delete(id: string){
    await prisma.itemTODO.delete({
      where: {
        id
      }
    });
  }
  
}