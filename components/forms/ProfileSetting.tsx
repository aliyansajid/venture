"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { profileSchema } from "@/lib/utils";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { useToast } from "@/components/ui/use-toast";
import { fetchProfile, updateProfile } from "@/app/actions/profileActions";

const ProfileSetting = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const userInfo = async () => {
      try {
        const result = await fetchProfile();

        if (result?.success && result.user) {
          form.reset({
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
            phone: result.user.phone || "",
          });
          setProfileImageUrl(result.user.image ?? null);
        } else {
          toast({
            description: result?.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    userInfo();
  }, [form, toast]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName as string);
      formData.append("lastName", values.lastName as string);
      formData.append("phone", values.phone as string);

      if (image) {
        formData.append("image", image);
      }

      const result = await updateProfile(formData);

      if (result?.success) {
        toast({
          description: result.message,
          variant: "default",
        });

        if (result.updatedUser && result.updatedUser.image) {
          setProfileImageUrl(result.updatedUser.image);
        }
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Failed to update profile.",
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
            <div>
              <Skeleton className="w-32 h-32 rounded-full" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
            <div
              className="relative w-32 h-32 border border-border-primary bg-background-tertiary rounded-full overflow-hidden cursor-pointer group"
              onClick={handleImageClick}
            >
              {(image || profileImageUrl) && (
                <Image
                  src={image ? URL.createObjectURL(image) : profileImageUrl!}
                  alt="Profile Pic"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0">
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Image
                    src="/icons/Camera.svg"
                    alt="Camera Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                hidden
              />
            </div>

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
              readOnly={true}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
            />

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

export default ProfileSetting;
