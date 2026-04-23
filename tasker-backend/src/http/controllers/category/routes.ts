import { FastifyInstance } from "fastify";
import { createCategory } from "./createCategory";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { updateCategory } from "./updateCategory";
import { deleteCategory } from "./deleteCategory";
export async function categoryTODORoutes(app: FastifyInstance) {

  app.addHook("onRequest", verifyJWT);
  app.post('/category', createCategory);
  app.put('/category/:id', updateCategory);
  app.delete('/category/:id', deleteCategory);
}