import bcrypt from "bcrypt";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const data: any = await req.json();
    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(422).json({ error: "Email taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      { user },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error));
  }
}
