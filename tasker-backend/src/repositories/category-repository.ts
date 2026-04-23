import { User, Category } from "@prisma/client";

export interface CategoryTodoRepository {
  create(name: string, userID: string, color: string): Promise<Category>;
  update(id: string, name: string, color: string): Promise<Category>;
  delete(id: string): Promise<void>;
}