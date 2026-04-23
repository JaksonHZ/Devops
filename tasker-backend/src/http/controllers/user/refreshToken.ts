import { FastifyRequest, FastifyReply } from "fastify";

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {

  
  try {
    await request.jwtVerify();

    const access_token = await reply.jwtSign({ email: request.user.email }, {sign: { sub: request.user.sub, expiresIn: '1h' }});
    const refresh_token = await reply.jwtSign({ email: request.user.email }, {sign: { sub: request.user.sub, expiresIn: '12h'}});

    return reply.status(200).send({
      access_token,
      refresh_token
    });

  } catch(error) {
    console.error(error);
    return reply.code(401).send({ message: "invalid Credentials" });
  }
}