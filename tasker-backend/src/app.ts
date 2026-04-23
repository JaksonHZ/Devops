import fastify from "fastify";
import { userRoutes } from "./http/controllers/user/routes";
import { listTODORoutes } from "./http/controllers/listTODO/routes";
import { itemTODORoutes } from "./http/controllers/itemTODO/routes";
import { categoryTODORoutes } from "./http/controllers/category/routes";
import { ZodError } from "zod";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import fastifyCors from "@fastify/cors";

export const app = fastify();

app.register(fastifyCors, {
  origin: '*',
})
app.register(fastifyJwt, {
  secret: env.SECRET_JWT
})
app.register(userRoutes);
app.register(listTODORoutes);
app.register(itemTODORoutes);
app.register(categoryTODORoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError){
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format()});
  }

  return reply.status(500).send({ message: 'Internal server error.'});
});