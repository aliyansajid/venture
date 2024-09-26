"use server";

import { db } from "@/lib/prisma";

export async function fetchTeamData() {
  try {
    const teamLeads = await db.user.findMany({
      where: { role: "Team Lead" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
      },
    });

    const teamMembers = await db.user.findMany({
      where: { role: "Team Member" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
      },
    });

    return {
      success: true,
      teamLeads,
      teamMembers,
    };
  } catch (error) {
    console.error("Error fetching team members and lead: ", error);
    return {
      success: false,
      message: "Failed to fetch team leads and members.",
    };
  }
}

export async function fetchTeam(teamId: string) {
  try {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        teamLead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!team) {
      return {
        success: false,
        message: "Team not found.",
        status: 404,
      };
    }

    const members = await db.user.findMany({
      where: {
        id: {
          in: team.membersIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return {
      success: true,
      team: {
        id: team.id,
        teamName: team.teamName,
        teamLead: team.teamLead,
        teamMembers: members,
        description: team.description,
        createdAt: team.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching team: ", error);
    return {
      success: false,
      message: "Failed to fetch team.",
      status: 500,
    };
  }
}

export async function fetchTeams(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  try {
    const teams = await db.team.findMany({
      skip,
      take: limit,
      include: {
        teamLead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    const totalTeams = await db.team.count();

    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await db.user.findMany({
          where: {
            id: {
              in: team.membersIds,
            },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            image: true,
          },
        });

        return {
          id: team.id,
          teamName: team.teamName,
          teamLead: team.teamLead,
          teamMembers: members,
          createdAt: team.createdAt,
        };
      })
    );

    return {
      success: true,
      teams: teamsWithMembers,
      totalTeams,
      totalPages: Math.ceil(totalTeams / limit),
    };
  } catch (error) {
    console.error("Error fetching teams: ", error);
    return {
      success: false,
      message: "Failed to fetch teams.",
      status: 500,
    };
  }
}

export async function createTeam(values: any) {
  const { teamName, teamLead, teamMembers, description } = values;

  try {
    const newTeam = await db.team.create({
      data: {
        teamName,
        teamLead: {
          connect: { id: teamLead },
        },
        membersIds: teamMembers,
        description,
      },
    });

    return {
      success: true,
      message: "Team created successfully.",
      team: newTeam,
    };
  } catch (error) {
    console.error("Error creating team: ", error);
    return {
      success: false,
      message: "Failed to create team.",
      status: 500,
    };
  }
}

export async function updateTeam(teamId: string, data: any) {
  const { teamName, teamLead, teamMembers, description } = data;

  try {
    const updatedTeam = await db.team.update({
      where: { id: teamId },
      data: {
        teamName,
        description,
        teamLead: {
          connect: { id: teamLead },
        },
        membersIds: teamMembers,
      },
    });

    const members = await db.user.findMany({
      where: {
        id: {
          in: updatedTeam.membersIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return {
      success: true,
      message: "Team updated successfully.",
      team: {
        ...updatedTeam,
        members,
      },
    };
  } catch (error) {
    console.error("Error updating team: ", error);
    return {
      success: false,
      message: "Failed to update team.",
      status: 500,
    };
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const team = await db.team.delete({
      where: { id: teamId },
    });

    return {
      success: true,
      message: "Team deleted successfully.",
      team,
    };
  } catch (error) {
    console.error("Error deleting team: ", error);
    return {
      success: false,
      message: "Failed to delete team.",
      status: 500,
    };
  }
}

export async function deleteTeams(ids: string[]) {
  try {
    const result = await db.team.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return {
      success: true,
      message:
        result.count === 1
          ? "1 team deleted successfully."
          : `${result.count} teams deleted successfully.`,
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Error deleting teams: ", error);
    return {
      success: false,
      message: "Failed to delete teams.",
      status: 500,
    };
  }
}
