import { useEffect, useState } from "react";
import {
  followUser,
  unfollowUser,
  checkFollowing,
} from "../services/follow.service";

type FollowButtonProps = {
  userId: number;
};

export default function FollowButton({
  userId,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFollowStatus() {
      try {
        setLoading(true);
        setError("");

        const response =
          await checkFollowing(userId);

        setFollowing(
          response.data.following
        );
      } catch (error: any) {
        console.error(
          "Failed to check follow status:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to check follow status"
        );
      } finally {
        setLoading(false);
      }
    }

    loadFollowStatus();
  }, [userId]);

  async function handleToggleFollow() {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
      } else {
        await followUser(userId);
        setFollowing(true);
      }
    } catch (error: any) {
      console.error(
        "Failed to update follow status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update follow status"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggleFollow}
        disabled={loading}
        className={`rounded-lg px-4 py-2 font-semibold ${
          following
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:opacity-50`}
      >
        {loading
          ? "Loading..."
          : following
          ? "Following"
          : "Follow"}
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}