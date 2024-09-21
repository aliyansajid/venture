"use server";

import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function fetchUser(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
        status: 404,
      };
    }

    return {
      success: true,
      user,
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching user: ", error);
    return {
      success: false,
      message: "Failed to fetch user.",
      status: 500,
    };
  }
}

export async function fetchUsers(page: number, limit: number) {
  const skip = (page - 1) * limit;

  try {
    const users = await db.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        createdAt: true,
      },
    });

    const totalUsers = await db.user.count();

    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dateOfJoining: user.createdAt,
      image: user.image,
    }));

    return {
      success: true,
      status: 200,
      users: formattedUsers,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    };
  } catch (error) {
    console.error("Error fetching users: ", error);
    return {
      success: false,
      message: "Failed to fetch users.",
      status: 500,
    };
  }
}

export async function updateUser(userId: string, values: any) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
      },
    });

    return {
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
      status: 200,
    };
  } catch (error) {
    console.error("Error updating user: ", error);
    return {
      success: false,
      message: "Failed to update user.",
      status: 500,
    };
  }
}

export async function deleteUser(userId: string) {
  const session = await auth();

  if (userId === session?.user.id) {
    return {
      success: false,
      message: "You cannot delete your own account.",
      status: 400,
    };
  }

  const isTeamLead = await db.team.findFirst({
    where: { teamLeadId: userId },
  });

  if (isTeamLead) {
    return {
      success: false,
      message:
        "Cannot delete the user because they are a team lead. Please reassign the team lead before deletion.",
    };
  }

  try {
    await db.note.deleteMany({
      where: { authorId: userId },
    });

    const user = await db.user.deleteMany({
      where: { id: userId },
    });

    return {
      success: true,
      message: "User and associated data deleted successfully.",
      status: 200,
    };
  } catch (error) {
    console.error("Error deleting user: ", error);
    return {
      success: false,
      message: "Failed to delete user.",
      status: 500,
    };
  }
}

export async function deleteUsers(ids: string[]) {
  const session = await auth();

  if (ids.includes(session?.user.id as string)) {
    return {
      success: false,
      message: "You cannot delete your own account.",
      status: 400,
    };
  }

  try {
    const result = await db.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "No users were found to delete.",
        status: 404,
      };
    }

    return {
      success: true,
      message:
        result.count === 1
          ? "1 user deleted successfully."
          : `${result.count} users deleted successfully.`,
      deletedCount: result.count,
      status: 200,
    };
  } catch (error) {
    console.error("Error deleting users: ", error);
    return {
      success: false,
      message: "Failed to delete users.",
      status: 500,
    };
  }
}
