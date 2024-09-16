"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { sendOTP } from "./sendOTP";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function register(values: any) {
  const { firstName, lastName, email, password } = values;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      return {
        success: false,
        message: "User already exists with this email.",
        status: 409,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });
    await sendOTP(email, firstName);

    return { success: true };
  } catch (error: any) {
    console.error("Error registering user: ", error);
    return { success: false, message: "Failed to register user.", status: 500 };
  }
}

export async function login(values: any, callbackUrl?: string | null) {
  const { email, password } = values;

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
      status: 401,
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password as string
  );

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid email or password",
      status: 401,
    };
  }

  if (!user.emailVerified) {
    await sendOTP(email, user.firstName);
    return {
      success: false,
      message: "Email not verified",
      status: 403,
      firstName: user.firstName,
    };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl || "/",
    });

    if (result?.error) {
      return { success: false, message: result.error, status: 401 };
    }

    return { success: true, status: 200, url: result?.url };
  } catch (error: any) {
    console.error("Error logging user: ", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
            status: 401,
          };
        default:
          return {
            success: false,
            message: "Something went wrong!",
            status: 500,
          };
      }
    }
    throw error;
  }
}

export async function verifyOTP(values: any) {
  const { email, otp } = values;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    if (user.otp !== otp) {
      return {
        success: false,
        message: "The OTP you have entered is incorrect.",
        status: 400,
      };
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return {
        success: false,
        message: "The OTP you have entered is expired.",
        status: 400,
      };
    }

    await db.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        emailVerified: true,
      },
    });

    return {
      success: true,
      message: "Email verified successfully.",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error verifying OTP: ", error);
    return {
      success: false,
      message: "An error occurred during verification",
      status: 500,
    };
  }
}
