import bcrypt from "bcryptjs";
import {prisma} from "../../config/database";

const SALT_ROUNDS = 10;

type RegisterInput = {
    email: string;
    password: string;
    name?: string;
};

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