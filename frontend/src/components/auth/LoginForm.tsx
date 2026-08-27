import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onIdentityChange?: (
    email: string
  ) => void;
};

export default function LoginForm({
  onIdentityChange,
}: LoginFormProps) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<LoginFormData>();

  async function onSubmit(
    data: LoginFormData
  ) {
    try {
      setIsSubmitting(true);
      setServerError("");

      const response =
        await login(data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      navigate("/");
    } catch (error: any) {
      console.error(
        "Login failed:",
        error
      );

      setServerError(
        error.response?.data
          ?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
          Welcome back
        </p>

        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Sign in to TrendAfrica
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Join the conversation.
          Discover what Africa is
          talking about.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-5"
      >
        {/* Email */}

        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Email
          </label>

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={
              errors.email
                ? "true"
                : "false"
            }
            className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 ${
              errors.email
                ? "border-red-400/60 focus:border-red-400"
                : "border-white/10 focus:border-blue-400 focus:bg-white/[0.06]"
            }`}
            {...register(
              "email",
              {
                required:
                  "Email is required",
              }
            )}
            onChange={(event) => {
              onIdentityChange?.(
                event.target.value
              );
            }}
          />

          {errors.email && (
            <p className="mt-2 text-xs text-red-400">
              {
                errors.email
                  .message
              }
            </p>
          )}
        </div>

        {/* Password */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <button
              type="button"
              className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
              onClick={() => {
                setServerError(
                  "Password recovery will be available in a future authentication update."
                );
              }}
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={
                errors.password
                  ? "true"
                  : "false"
              }
              className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-slate-600 ${
                errors.password
                  ? "border-red-400/60 focus:border-red-400"
                  : "border-white/10 focus:border-blue-400 focus:bg-white/[0.06]"
              }`}
              {...register(
                "password",
                {
                  required:
                    "Password is required",
                }
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-xs text-red-400">
              {
                errors.password
                  .message
              }
            </p>
          )}
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
        >
          <span className="relative z-10">
            {isSubmitting
              ? "Signing in..."
              : "Sign in"}
          </span>
        </button>
      </form>

      {/* Registration */}

      <div className="mt-7 border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-slate-500">
          New to TrendAfrica?
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/register")
          }
          className="mt-2 font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Create your account
        </button>
      </div>

      <p className="mt-8 text-center text-xs leading-5 text-slate-600">
        Your account credentials
        are securely processed through
        TrendAfrica's existing
        authentication system.
      </p>
    </div>
  );
}