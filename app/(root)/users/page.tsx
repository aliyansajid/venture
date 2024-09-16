"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import TopHeader from "@/components/TopHeader";
import SectionHeader from "@/components/SectionHeader";
import Loader from "@/components/Loader";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/DataTable/Columns";
import { FilterValue, User } from "@/types/next-auth";
import { fetchUsers } from "@/app/actions/userActions";

const Users = () => {
  const { toast } = useToast();
  const [data, setData] = useState<User[]>([]);
  const [roles, setRoles] = useState<FilterValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleFetchUsers = async (page = 1, limit = 10) => {
    try {
      const result = await fetchUsers(page, limit);

      if (result?.users && result?.totalPages !== undefined) {
        setData(result.users ?? []);
        setTotalPages(result.totalPages ?? 1);

        const roles: FilterValue[] = Array.from(
          new Set(result.users.map((user: User) => user.role))
        ).map((role) => ({
          key: role,
          value: role,
        }));

        setRoles(roles);
      } else {
        toast({
          description: "An unexpected error occurred while fetching the users",
          variant: "destructive",
        });
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
    handleFetchUsers(page, pageSize);
  }, [page, pageSize]);

  return (
    <section>
      <TopHeader />
      <SectionHeader title="Users" />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-8">
          <DataTable
            data={data}
            columns={columns}
            searchColumnKey="name"
            filterColumnKey="role"
            filterValues={roles}
            filterTitle="Role"
            entity="users"
            onUpdate={() => handleFetchUsers(page, pageSize)}
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

export default Users;
