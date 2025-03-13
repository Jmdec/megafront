"use client";

import { useState } from "react";
import { showToast } from "@/components/toast"; // ✅ Import toast
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // ✅ Import React Icons

interface ForgotPasswordProps {
  onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle for new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ Toggle for confirm password

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("OTP sent to your email.", "success");
        setStep("otp");
      } else {
        setError(data.message || "Email not registered.");
        showToast(data.message || "Email not registered.", "error");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("OTP verified successfully.", "success");
        setStep("reset");
      } else {
        setError(data.message || "Invalid OTP.");
        showToast(data.message || "Invalid OTP.", "error");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Password reset successfully.", "success");
        onClose();
      } else {
        setError(data.message || "Failed to reset password.");
        showToast(data.message || "Failed to reset password.", "error");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold text-center mb-4">
          {step === "email"
            ? "Reset Password"
            : step === "otp"
            ? "Enter OTP"
            : "Set New Password"}
        </h2>

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-center">
          <button className="text-blue-500 hover:underline" onClick={onClose}>
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
