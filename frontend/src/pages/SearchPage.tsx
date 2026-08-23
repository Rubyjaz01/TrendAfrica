import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchUsers,
  type SearchUser,
} from "../services/search.service";
import FollowButton from "../components/FollowButton";

export default function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getCurrentUserId(): number | null {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      if (typeof user.id !== "number") {
        return null;
      }

      return user.id;
    } catch (error) {
      console.error(
        "Failed to read current user:",
        error
      );

      return null;
    }
  }

  async function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUsers([]);
      setError("Enter a name or username.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await searchUsers(
        trimmedQuery
      );

      const currentUserId =
        getCurrentUserId();

      const filteredUsers =
        response.data.filter(
          (user: SearchUser) =>
            user.id !== currentUserId
        );

      setUsers(filteredUsers);
    } catch (error: any) {
      console.error(
        "Failed to search users:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Search failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">
          Discover People
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search by name or username..."
            className="flex-1 rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {users.length === 0 &&
            !loading &&
            !error && (
              <p className="text-gray-500">
                Search for a user to get started.
              </p>
            )}

          {users.length === 0 &&
            !loading &&
            !error &&
            query.trim() && (
              <p className="text-gray-500">
                No users found.
              </p>
            )}

          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:bg-gray-50"
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/users/${user.id}`
                  )
                }
                className="flex min-w-0 flex-1 items-center gap-4 text-left"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold">
                    {user.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {user.fullName}
                  </p>

                  {user.username && (
                    <p className="truncate text-sm text-gray-500">
                      @{user.username}
                    </p>
                  )}

                  {user.bio && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {user.bio}
                    </p>
                  )}
                </div>
              </button>

              <div className="shrink-0">
                <FollowButton
                  userId={user.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}