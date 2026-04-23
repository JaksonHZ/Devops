import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { BcryptHash } from "../../cryptography/bcrypt/bcrypt";
import { AuthenticateUseCase } from "../user/authenticate-usecase";
export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUserRepository();
  const hash = new BcryptHash();
  const makeAuthenticateUseCase = new AuthenticateUseCase(usersRepository, hash);

  return makeAuthenticateUseCase;
};
