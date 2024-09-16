"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomButton, { ButtonVariant } from "@/components/CustomButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTPFormProps } from "@/types/next-auth";
import { verifyOTP } from "@/app/actions/authActions";
import { sendOTP } from "@/app/actions/sendOTP";

const OTPForm = ({ email, firstName }: OTPFormProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleOTPChange = (value: string) => {
    setOtp(value);
    setMessage("");
  };

  const handleVerifyOTP = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await verifyOTP({ email, otp });

      if (!result.success) {
        setMessage(result.message);
        setMessageType("error");
        return;
      }

      setMessage(result.message);
      setMessageType("success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage("Invalid or expired OTP. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }, [email, otp]);

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const result = await sendOTP(email, firstName);
      if (!result.status) {
        setMessage(result.message);
        setMessageType("error");
      } else {
        setMessage(result.message);
        setMessageType("success");
      }
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.");
      setMessageType("error");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp, verifyOTP]);

  return (
    <>
      {message && (
        <div
          className={`text-sm ${
            messageType === "success" ? "text-dark-positive" : "text-dark-error"
          }`}
        >
          {message}
        </div>
      )}

      <InputOTP maxLength={6} value={otp} onChange={handleOTPChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSeparator />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="space-y-2">
        <CustomButton
          variant={ButtonVariant.DEFAULT}
          text="Verify OTP"
          onClick={handleVerifyOTP}
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full"
        />
        <CustomButton
          variant={ButtonVariant.OUTLINE}
          text="Resend OTP"
          onClick={handleResendOTP}
          disabled={isResending}
          isLoading={isResending}
          className="w-full"
        />
      </div>
    </>
  );
};

export default OTPForm;
