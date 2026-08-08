import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-blue-600">
            TrendAfrica
          </h1>

          <div className="text-sm text-gray-500">
            Welcome
          </div>
        </div>
      </header>

      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}