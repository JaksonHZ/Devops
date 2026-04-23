import { FastifyRequest, FastifyReply } from "fastify";
import zod from "zod";
import { makeAuthenticateUseCase } from "../../../use-cases/factories/make-authenticate-usecase";
import { InvalidCredentialsError } from "../../../use-cases/errors/invalid-credencials";
export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {

  const bodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { email, password } = bodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const access_token = await reply.jwtSign({ email: user.email }, {sign: { sub: user.id, expiresIn: '1h' }});
    const refresh_token = await reply.jwtSign({ email: user.email }, {sign: { sub: user.id, expiresIn: '12h'}});

    return reply.status(200).send({
      access_token,
      refresh_token
    });

  } catch(error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({message: error.message})
    }
    
    throw error;
  }
}