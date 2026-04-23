import { User, ListTODO, Category } from "@prisma/client";

export interface UserRepository {
  create(username: string, passwordHash: string, email: string): Promise<User>;
  findById(id: string): Promise<User | null>;
  findUniqueEmail(email: string): Promise<User | null>;
  findLists(id: string): Promise<ListTODO[]>;  
  findCategories(id: string): Promise<Category[]>;
}