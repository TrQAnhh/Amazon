import {Injectable} from '@nestjs/common';
import {AuthResponse, SignInDto, SignUpDto} from "@app/common";
import {InjectRepository} from "@nestjs/typeorm";
import {IdentityEntity} from "../entity/identity.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {GrpcAlreadyExistsException} from "nestjs-grpc-exceptions";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class IdentityService {

    constructor(
        @InjectRepository(IdentityEntity)
        private readonly identityRepo: Repository<IdentityEntity>,
        private jwtService: JwtService,
    ) {}

    async findUserByEmail(email: string): Promise<IdentityEntity | null> {
        return this.identityRepo.findOne({
            where: {
                email: email
            },
        })
    }

    async signIn(signInDto: SignInDto): Promise<AuthResponse> {

        return {
            message: "login successfully!",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
        }
    }

    async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {

        const userByEmail = await this.findUserByEmail(signUpDto.email);

        if (userByEmail) {
            throw new GrpcAlreadyExistsException("Email has already been registered!");
        }

        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        const user = this.identityRepo.create({
            ...signUpDto,
            password: hashedPassword,
        });

        const result = await this.identityRepo.save(user);

        return {
            message: "register successfully!",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
        }
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<IdentityEntity | null> {
        const existingUser = await this.findUserByEmail(email);

        if (
            existingUser &&
            (await bcrypt.compare(password, existingUser.password))
        ) {
            return existingUser;
        }
        return null;
    }
}
