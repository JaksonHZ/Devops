import { User, ItemTODO } from "@prisma/client";

export interface ItemTodoRepository {
  create(title: string, listTODOId: string, order: number, description?: string, categoryId?: string): Promise<ItemTODO>;
  findById(id: string): Promise<ItemTODO | null>;
  update(id: string, title?: string, description?: string, categoryId?: string, done?: boolean, order?: number): Promise<ItemTODO | null>;
  changeList(id: string, listTODOId: string, order: number): Promise<ItemTODO | null>;
  delete(id: string): Promise<void>;
}