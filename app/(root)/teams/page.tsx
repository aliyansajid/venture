"use client";

import { useState, useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";
import AddTeamButton from "@/components/Teams/AddTeamButton";
import TopHeader from "@/components/TopHeader";
import { DataTable } from "@/components/DataTable/DataTable";
import { teamColumns } from "@/components/DataTable/TeamColumns";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import { FilterValue, Team } from "@/types/next-auth";
import { fetchTeams } from "@/app/actions/teamActions";

const Teams = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamLead, setTeamLead] = useState<FilterValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleFetchTeams = async (page = 1, limit = 10) => {
    try {
      const result = await fetchTeams(page, limit);

      if (!result.success) {
        toast({
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      setTeams(result.teams ?? []);
      setTotalPages(result.totalPages ?? 1);

      if ((result.teams ?? []).length > 0) {
        const teamLead: FilterValue[] = Array.from(
          new Set((result.teams ?? []).map((team) => team?.teamLead))
        ).map((teamLead) => ({
          key: teamLead?.id,
          value: `${teamLead?.firstName} ${teamLead?.lastName}`,
        }));
        setTeamLead(teamLead);
      } else {
        setTeamLead([]);
      }
    } catch (error: any) {
      toast({
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchTeams(page, pageSize);
  }, [page, pageSize]);

  return (
    <section>
      <TopHeader />
      <SectionHeader title="Teams">
        <AddTeamButton />
      </SectionHeader>

      {isLoading ? (
        <Loader />
      ) : teams.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-144px)]">
          <h1 className="text-xl font-medium">
            You have not created any teams yet.
          </h1>
        </div>
      ) : (
        <div className="px-4 py-8 md:p-8">
          <DataTable
            data={teams}
            columns={teamColumns}
            searchColumnKey="teamName"
            filterColumnKey="teamLead"
            filterValues={teamLead}
            filterTitle="Team Lead"
            entity="teams"
            onUpdate={() => handleFetchTeams(page, pageSize)}
            currentPage={page}
            totalPages={totalPages}
            setPage={setPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
    </section>
  );
};

export default Teams;
