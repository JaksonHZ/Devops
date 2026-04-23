import { User } from "@prisma/client";
import { Hash } from "../../cryptography/hash";
import { UserRepository } from "../../repositories/users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credencials";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UserRepository,
    private hash: Hash,
    ) {}

  async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findUniqueEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await this.hash.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user
    }
  }
}

