"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 w-full max-w-md transform transition-all">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight italic">Welcome Back</h1>
            <p className="text-gray-400 font-medium">Log in to your premium account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {mutation.isError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>{(mutation.error as any).message || "Invalid credentials"}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full bg-gray-50 border ${errors.email ? 'border-red-200' : 'border-gray-100'} rounded-2xl py-5 pl-14 pr-5 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  {...register("password")}
                  type="password"
                  className={`w-full bg-gray-50 border ${errors.password ? 'border-red-200' : 'border-gray-100'} rounded-2xl py-5 pl-14 pr-5 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-blue-700 disabled:bg-blue-300 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-200"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : "Sign In Now"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 font-medium">
              New here?{" "}
              <Link href="/register" className="text-blue-600 font-black hover:underline underline-offset-4 decoration-2">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
