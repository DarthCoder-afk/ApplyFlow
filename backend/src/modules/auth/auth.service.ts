import bcrypt from "bcryptjs";
import {prisma} from "../../config/database";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

const SALT_ROUNDS = 10;

type RegisterInput = {
    email: string;
    password: string;
    name?: string;
};

type LoginInput = {
    email: string;
    password: string;
}

export async function registerUser(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email,
        }
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
        },

        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
    return user;
}

export async function loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({
        where: {
            email: input.email,
        }
    });

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const payload = { userId: user.id };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        }
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
}