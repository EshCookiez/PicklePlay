"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import logo from "../../images/PicklePlayLogo.jpg";

export default function AuthPage() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Signup state
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const strengthLevels = [
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
    ];

    return strengthLevels[Math.min(strength - 1, 3)] || { strength: 0, label: "", color: "" };
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!signupData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!signupData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      // Simulate backend login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store user in localStorage
      const userData = {
        id: "user123",
        name: "Jea Bayona",
        email: loginData.email,
        avatar: "JB",
        memberSince: "Jan 2025"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirect to profile
      router.push("/profile");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setLoading(true);
    try {
      // Simulate backend signup
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store user in localStorage
      const userData = {
        id: "user123",
        name: `${signupData.firstName} ${signupData.lastName}`,
        email: signupData.email,
        avatar: signupData.firstName[0] + signupData.lastName[0],
        memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirect to profile
      router.push("/profile");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(signupData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a56a7] blue- to-[#a3ff01] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Flip Card Container */}
        <div
          style={{
            perspective: "1000px",
            height: isFlipped ? "600px" : "550px",
          }}
          className="transition-all duration-500"
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            }}
            className="relative w-full h-full"
          >
            {/* LOGIN SIDE */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50 backdrop-blur-sm"
            >
              {/* Login Header with Logo */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200/50">
                <Image
                  src={logo}
                  alt="PicklePlay Logo"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg flex-shrink-0"
                />
                <div>
                  <h1 className="text-3xl font-bold text-[#0a56a7] leading-tight">Welcome Back</h1>
                  <p className="text-gray-500 text-sm font-medium">Sign in to your account</p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="login-email"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData({ ...loginData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 placeholder:text-gray-600 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border transition focus:outline-none focus:ring-2 placeholder:text-gray-600 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#0a56a7] focus:ring-[#0a56a7]"
                    />
                    <span className="text-sm text-gray-700 font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#0a56a7] hover:text-[#a3ff01] transition font-semibold">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Flip to Signup */}
              <p className="text-center text-gray-600 mt-6 pt-6 border-t border-gray-200/50 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setIsFlipped(true);
                    setErrors({});
                  }}
                  className="text-[#0a56a7] hover:text-[#a3ff01] font-bold transition"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* SIGNUP SIDE */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50 backdrop-blur-sm overflow-y-auto"
            >
              {/* Signup Header with Logo */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200/50">
                <Image
                  src={logo}
                  alt="PicklePlay Logo"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg flex-shrink-0"
                />
                <div>
                  <h1 className="text-3xl font-bold text-[#0a56a7] leading-tight">Join PicklePlay</h1>
                  <p className="text-gray-500 text-xs font-medium">Create your account</p>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="firstName"
                        value={signupData.firstName}
                        onChange={(e) => {
                          setSignupData({ ...signupData, firstName: e.target.value });
                          if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                        }}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${
                          errors.firstName
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="lastName"
                        value={signupData.lastName}
                        onChange={(e) => {
                          setSignupData({ ...signupData, lastName: e.target.value });
                          if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                        }}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${
                          errors.lastName
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-900 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="signup-email"
                      value={signupData.email}
                      onChange={(e) => {
                        setSignupData({ ...signupData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-900 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      id="signup-password"
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      className={`w-full pl-10 pr-12 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signupData.password && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-900 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showSignupConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      value={signupData.confirmPassword}
                      onChange={(e) => {
                        setSignupData({ ...signupData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      className={`w-full pl-10 pr-12 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: undefined });
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#0a56a7] focus:ring-[#0a56a7] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-[#0a56a7] hover:text-[#a3ff01] transition font-semibold">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#0a56a7] hover:text-[#a3ff01] transition font-semibold">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-0.5">{errors.terms}</p>}

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              {/* Flip to Login */}
              <p className="text-center text-gray-600 mt-4 pt-4 border-t border-gray-200/50 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setErrors({});
                  }}
                  className="text-[#0a56a7] hover:text-[#a3ff01] font-bold transition"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
