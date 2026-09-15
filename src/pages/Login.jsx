import { Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import useLogin from "../hooks/accounts/useLogin";

export default function Login() {
  const {
    formData,
    showPassword,
    isLoading,
    error,
    handleChange,
    toggleShowPassword,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-sm">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            ApexAdmin Console
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in using your phone number and password
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Field */}
          <div>
            <label 
              htmlFor="phone" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Phone Number
            </label>
            <div className="relative mt-2 flex rounded-lg border border-slate-700 bg-slate-800/60 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <span className="flex items-center pl-3 text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <span className="flex items-center pl-2 text-xs font-medium text-slate-400">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
            </div>
            <div className="relative mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800/60 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <span className="pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="pr-3 text-slate-400 transition hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}