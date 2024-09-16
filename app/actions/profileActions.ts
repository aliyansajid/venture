"use server";

import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function fetchProfile() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return {
      success: false,
      message: "Unauthorized access. Please log in again.",
      status: 401,
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return { success: false, message: "User not found.", status: 404 };
    }

    return { success: true, user, status: 200 };
  } catch (error: any) {
    console.error("Error fetching user data: ", error);
    return {
      success: false,
      message: "Failed to load user data.",
      status: 500,
    };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return {
      success: false,
      message: "Unauthorized access. Please log in again.",
      status: 401,
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
        status: 404,
      };
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as File | null;

    let imageUrl = user.image;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile_images",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      imageUrl = (uploadResult as { secure_url: string }).secure_url;
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        phone,
        image: imageUrl,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully.",
      updatedUser,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error updating profile: ", error);
    return {
      success: false,
      message: "Failed to update profile.",
      status: 500,
    };
  }
}
