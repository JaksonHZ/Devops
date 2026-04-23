import { CategoryTodoRepository } from "../category-repository";
import { prisma } from "../../lib/prisma";
export class PrismaCategoryTodoRepository implements CategoryTodoRepository {
  
  async create(name: string, userId: string, color: string){
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId
      }
    });
    return category;
  }

  async update(id: string, name: string, color: string){
    const category = await prisma.category.update({
      where: {
        id
      },
      data: {
        name,
        color
      }
    });

    return category;
  }

  async delete(id: string){
    await prisma.category.delete({
      where: {
        id
      }
    });
  }
}