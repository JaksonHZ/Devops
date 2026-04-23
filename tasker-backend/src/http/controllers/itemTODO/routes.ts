import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createItem } from "./createItem";
import { updateItem } from "./updateItem";
import { changeList } from "./changeList";
import { deleteItem } from "./deleteItem";

export async function itemTODORoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);
  app.post("/item", createItem);
  app.put("/item/:id", updateItem);
  app.put("/changelist", changeList);
  app.delete("/item/:id", deleteItem);
}