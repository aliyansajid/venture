"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userEditSchema } from "@/lib/utils";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectItem } from "@/components/ui/select";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { useToast } from "@/components/ui/use-toast";
import { EditUserProps } from "@/types/next-auth";
import { fetchUser, updateUser } from "@/app/actions/userActions";

const EditUser = ({ userId, onSuccess }: EditUserProps) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await fetchUser(userId as string);

        if (result.success && result.user) {
          const userData = {
            ...result.user,
            phone: result.user.phone ?? undefined,
          };
          form.reset(userData);
        } else {
          toast({
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserData();
  }, [userId, form, toast]);

  const onSubmit = async (values: z.infer<typeof userEditSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateUser(userId as string, values);

      if (result.success) {
        toast({
          description: result.message,
          variant: "default",
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Failed to update user data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {isDataLoading ? (
          <>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
            <div className="flex gap-4">
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>
            </div>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="role"
              label="Role"
              placeholder="Select a role"
            >
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Team Lead">Team Lead</SelectItem>
              <SelectItem value="Team Member">Team Member</SelectItem>
              <SelectItem value="Client">Client</SelectItem>
            </CustomFormField>

            <CustomButton
              variant={ButtonVariant.DEFAULT}
              text={"Save Changes"}
              className="w-full"
              disabled={isLoading || isDataLoading}
              isLoading={isLoading}
            />
          </>
        )}
      </form>
    </Form>
  );
};

export default EditUser;
