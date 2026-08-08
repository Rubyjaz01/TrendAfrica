import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Link
          to="/"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Home
        </Link>

        <Link
          to="/search"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Search
        </Link>

        <Link
          to="/profile"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Profile
        </Link>

        <Link
          to="/notifications"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Notifications
        </Link>

        <button
          onClick={handleLogout}
          className="font-medium text-red-600 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}