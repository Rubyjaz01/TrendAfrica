
import { useForm } from "react-hook-form";
import { login } from "../services/auth.service";
type LoginForm = {
  email: string;
  password: string;
};
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
  } = useForm<LoginForm>();
  const navigate = useNavigate();

  async function onSubmit(data: LoginForm) {
  try {
    console.log("Sending:", data);

const response = await login(data);

console.log("Response:", response);

localStorage.setItem("token", response.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

alert("Login successful!");

// Save JWT
localStorage.setItem("token", response.data.token);

// Save logged-in user
localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

navigate("/");
  } catch (error: any) {
    console.error(error);

    alert(
      error.response?.data?.message || "Login failed"
    );
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
          TrendAfrica
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
              placeholder="Enter your password"
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}