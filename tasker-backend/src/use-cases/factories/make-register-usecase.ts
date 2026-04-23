import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { BcryptHash } from "../../cryptography/bcrypt/bcrypt";
import { RegisterUseCase } from "../user/register-usecase";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const hash = new BcryptHash();
  const registerUseCase = new RegisterUseCase(usersRepository, hash);

  return registerUseCase;
};
