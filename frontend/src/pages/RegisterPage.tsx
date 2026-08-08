import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/auth.service";

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
  } = useForm<RegisterForm>();

  const navigate = useNavigate();

  async function onSubmit(data: RegisterForm) {
  try {
    console.log("Sending registration:", data);

    const response = await registerUser(data);

console.log("Registration response:", response);

// Save JWT
localStorage.setItem("token", response.token);

// Save logged-in user
localStorage.setItem(
  "user",
  JSON.stringify(response.user)
);

// Redirect to Home
navigate("/");

    alert("Registration successful!");
  } catch (error: any) {
    console.error(error);

    alert(
      error.response?.data?.message || "Registration failed"
    );
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
          TrendAfrica
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Create your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              {...register("fullName")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              {...register("email")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}