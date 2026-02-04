"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Calendar, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import logo from "../../images/PicklePlayLogo.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, loginWithProvider } = useAuth();
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
    dateOfBirth: "",
    phoneNumber: "",
    location: "",
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
    if (!signupData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!signupData.location.trim()) {
      newErrors.location = "Location is required";
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
      await login({
        email: loginData.email,
        password: loginData.password,
      });

      toast.success("Welcome back!");
      // Navigate to homepage
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        toast.error(error.message || "Login failed. Please check your credentials.");
      }
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setLoading(true);
    try {
      await signup({
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        date_of_birth: signupData.dateOfBirth,
        phone_number: signupData.phoneNumber,
        location: signupData.location,
      });

      toast.success("Account created successfully!");
      // Navigate to homepage
      router.push("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.errors) {
        // Map backend errors to field names
        const fieldErrors: Record<string, string> = {};
        Object.keys(error.errors).forEach(key => {
          // Map snake_case to camelCase for state
          let mappedKey = key;
          if (key === 'first_name') mappedKey = 'firstName';
          if (key === 'last_name') mappedKey = 'lastName';
          if (key === 'date_of_birth') mappedKey = 'dateOfBirth';
          if (key === 'phone_number') mappedKey = 'phoneNumber';

          fieldErrors[mappedKey] = Array.isArray(error.errors[key])
            ? error.errors[key][0]
            : error.errors[key];
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialProviderLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      await loginWithProvider(provider);
      // Supabase signInWithOAuth redirects the whole page
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(error.message || `${provider} login failed.`);
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
            height: isFlipped ? "750px" : "580px",
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
              className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-6 border border-gray-200/50 backdrop-blur-sm overflow-y-auto scrollbar-hide"
            >
              {/* Login Header with Logo */}
              <div className="flex items-center gap-4 mb-4 pb-3 border-b border-gray-200/50">
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
              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 placeholder:text-gray-600 ${errors.email
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
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border transition focus:outline-none focus:ring-2 placeholder:text-gray-600 ${errors.password
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                      placeholder="********"
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
                  className="w-full py-3 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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

                {/* Social Login Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialProviderLogin('google')}
                    className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 disabled:opacity-50"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <title>Google</title>
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialProviderLogin('facebook')}
                    className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 disabled:opacity-50"
                  >
                    <svg className="mr-2 h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <title>Facebook</title>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </form>

              {/* Flip to Signup */}
              <p className="text-center text-gray-600 mt-4 pt-4 border-t border-gray-200/50 text-sm">
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
              className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-6 border border-gray-200/50 backdrop-blur-sm overflow-y-auto scrollbar-hide"
            >
              {/* Signup Header with Logo */}
              <div className="flex items-center gap-4 mb-3 pb-2 border-b border-gray-200/50">
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
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${errors.firstName
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
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${errors.lastName
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
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${errors.email
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>

                {/* Date of Birth Field */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-900 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      value={signupData.dateOfBirth}
                      onChange={(e) => {
                        setSignupData({ ...signupData, dateOfBirth: e.target.value });
                        if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: undefined });
                      }}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${errors.dateOfBirth
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-0.5">{errors.dateOfBirth}</p>}
                </div>

                {/* Optional: Phone & Location Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900 mb-1">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={signupData.phoneNumber}
                        onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20 transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600"
                        placeholder="+63..."
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-1">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="location"
                        value={signupData.location}
                        onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20 transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600"
                        placeholder="City, Province"
                      />
                    </div>
                  </div>
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
                      className={`w-full pl-10 pr-12 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${errors.password
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                      placeholder="********"
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
                      className={`w-full pl-10 pr-12 py-2 rounded-lg border transition focus:outline-none focus:ring-2 text-sm placeholder:text-gray-600 ${errors.confirmPassword
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#0a56a7] focus:ring-[#0a56a7]/20"
                        }`}
                      placeholder="********"
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

                {/* Social Signup Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 font-medium">Or join with</span>
                  </div>
                </div>

                {/* Social Signup Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialProviderLogin('google')}
                    className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 disabled:opacity-50"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <title>Google</title>
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialProviderLogin('facebook')}
                    className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 disabled:opacity-50"
                  >
                    <svg className="mr-2 h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <title>Facebook</title>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
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
