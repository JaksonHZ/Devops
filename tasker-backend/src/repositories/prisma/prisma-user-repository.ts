import { UserRepository } from "../users-repository";
import { prisma } from "../../lib/prisma";
export class PrismaUserRepository implements UserRepository {
  async create(username: string, passwordHash: string, email: string) {
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        email
      }
    })

    return user;
  }
  async findUniqueEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    return user;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    return user;
  }

  async findLists(id: string) {
    const lists = await prisma.listTODO.findMany({
      where: {
        userId: id
      },
      include:{
        ItemTODO: {
          orderBy: {
              order: 'asc'
          },
          include: {
            Category: true
          }
        },
      },
      orderBy: {
        orderNumber: 'asc',
      }
    })

    return lists;
  }

  async findCategories(id: string){
    const categories = await prisma.category.findMany({
      where: {
        userId: id
      }
    })

    return categories;
  }
}