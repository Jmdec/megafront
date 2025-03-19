"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { showToast } from "@/components/toast"; // ✅ Import toast
import ForgotPassword from "./forgotpassword";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // ✅ Import React Icons

export default function AuthModal() {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle password visibility
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isSignup
      ? `${API_BASE_URL}/api/register`
      : `${API_BASE_URL}/api/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
 
      if (response.ok) {
        if (!isSignup) {
          Cookies.set("auth_token", data.token, {
            expires: 7,
            secure: true,
            sameSite: "Strict",
          });

          showToast("Login successful!", "success");
          router.push("/admin");
        } else {
          showToast(data.message, "success");
          router.push("/auth");
        }
      } else {
        showToast(data.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred. Please try again.", "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {isForgotPassword ? (
            <ForgotPassword onClose={() => setIsForgotPassword(false)} />
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-center">
                {isSignup ? "Sign Up" : "Login"}
              </h2>
              <form onSubmit={handleSubmit}>
                {isSignup && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2 mb-3"
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 mb-3"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2 pr-10 mb-1"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                {/* Forgot Password Link */}
                {!isSignup && (
                  <p
                    className="text-sm text-blue-500 hover:underline cursor-pointer text-right mb-3"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot Password?
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  {isSignup ? "Sign Up" : "Login"}
                </button>
              </form>

              <p className="mt-4 text-sm text-center">
                {isSignup
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    )
  );
}
