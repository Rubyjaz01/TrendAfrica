import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Navigation() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] =
    useState(0);

  async function loadUnreadCount() {
    try {
      const response = await api.get(
        "/notifications/unread-count"
      );

      setUnreadCount(
        response.data.data.count
      );
    } catch (error) {
      console.error(
        "Failed to load unread notification count:",
        error
      );
    }
  }

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">

        {/* Home */}

        <Link
          to="/"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Home
        </Link>

        {/* Explore */}

        <Link
          to="/explore"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Explore
        </Link>

        {/* Search */}

        <Link
          to="/search"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Search
        </Link>

        {/* Profile */}

        <Link
          to="/profile"
          className="font-medium text-gray-700 hover:text-blue-600"
        >
          Profile
        </Link>

        {/* Notifications */}

        <Link
          to="/notifications"
          className="relative font-medium text-gray-700 hover:text-blue-600"
        >
          Notifications

          {unreadCount > 0 && (
            <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-2 text-sm font-bold text-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </Link>

        {/* Logout */}

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