"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authSchema } from "@/lib/utils";
import { z } from "zod";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { login, register } from "@/app/actions/authActions";
import ModalDialog from "../ModalDialog";
import OTPForm from "./OTPForm";
import { signIn } from "next-auth/react";

const AuthForm = ({ type }: { type: string }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const formSchema = authSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const resetErrorMessage = () => {
    setMessage("");
    setMessageType("success");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const result = await register(values);

        if (result.success) {
          setEmail(values.email);
          setFirstName(values.firstName as string);
          setShowOTP(true);
        } else {
          setMessage(result.message as string);
          setMessageType("error");
        }
      } else {
        const result = await login(values, callbackUrl);

        if (result.success) {
          if (result.url) {
            window.location.href = result.url;
          } else {
            window.location.href = "/";
          }
        } else {
          if (result.message === "Email not verified") {
            setEmail(values.email);
            setFirstName(result.firstName as string);
            setShowOTP(true);
          } else {
            setMessage(result.message);
            setMessageType("error");
          }
        }
      }
    } catch (error) {
      setMessageType("error");
      setMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <h1 className="text-3xl text-dark-primary font-medium">
            {type === "login" ? "Welcome Back!" : "Create an account"}
          </h1>
          <p className="text-base text-dark-secondary">
            {type === "login"
              ? "Log in to access your workspace."
              : "Sign up to get started and access your workspace."}
          </p>

          <Button
            className="group flex items-center w-full bg-white border border-interaction-outline-base hover:border-action-primary-base hover:bg-action-primary-base"
            type="button"
            onClick={() =>
              signIn("google", { callbackUrl: callbackUrl || "/" })
            }
          >
            <Image
              src="/images/google.svg"
              alt="Google Logo"
              width={24}
              height={24}
            />
            <span className="text-sm text-dark-primary font-medium group-hover:text-white">
              Continue with Google
            </span>
          </Button>

          <div className="flex items-center">
            <div className="flex-grow h-px bg-border-primary"></div>
            <span className="flex-shrink mx-4 text-xs text-dark-secondary">
              or
            </span>
            <div className="flex-grow h-px bg-border-primary"></div>
          </div>

          {message && (
            <div
              className={`text-sm ${
                messageType === "success"
                  ? "text-dark-positive"
                  : "text-dark-error"
              }`}
            >
              {message}
            </div>
          )}

          {type === "sign-up" && (
            <div className="flex space-x-4">
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  onChange={resetErrorMessage}
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  onChange={resetErrorMessage}
                />
              </div>
            </div>
          )}

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            onChange={resetErrorMessage}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            label="Password"
            placeholder={"********"}
            onChange={resetErrorMessage}
          />

          <CustomButton
            type="submit"
            variant={ButtonVariant.DEFAULT}
            text={type === "login" ? "Login" : "Sign Up"}
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          />
        </form>
      </Form>

      <p className="text-sm text-center mt-5">
        <span>
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        {type === "login" ? (
          <Link href="/sign-up" className="font-medium ml-1">
            Sign Up
          </Link>
        ) : (
          <Link href="/login" className="font-medium ml-1">
            Login
          </Link>
        )}
      </p>
      {showOTP && (
        <ModalDialog
          isOpen={showOTP}
          onClose={() => setShowOTP(false)}
          title="Email Verification"
          description="Please enter the OTP sent to your email address to verify your email."
        >
          <OTPForm email={email} firstName={firstName} />
        </ModalDialog>
      )}
    </>
  );
};

export default AuthForm;
