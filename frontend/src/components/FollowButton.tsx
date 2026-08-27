import { useEffect, useState } from "react";

import {
  followUser,
  unfollowUser,
  checkFollowing,
} from "../services/follow.service";

type FollowButtonProps = {
  userId: number;
  onFollowChange?: (
    following: boolean
  ) => void;
};

export default function FollowButton({
  userId,
  onFollowChange,
}: FollowButtonProps) {
  const [following, setFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFollowStatus() {
      try {
        setLoading(true);
        setError("");

        const response =
          await checkFollowing(userId);

        if (cancelled) {
          return;
        }

        setFollowing(
          Boolean(response.data.following)
        );
      } catch (error: any) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to check follow status:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to check follow status"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFollowStatus();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleToggleFollow() {
    if (loading) {
      return;
    }

    const nextFollowing =
      !following;

    try {
      setLoading(true);
      setError("");

      if (nextFollowing) {
        await followUser(userId);
      } else {
        await unfollowUser(userId);
      }

      setFollowing(nextFollowing);

      onFollowChange?.(
        nextFollowing
      );
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
        className={`rounded-lg px-4 py-2 font-semibold transition ${
          following
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:cursor-not-allowed disabled:opacity-50`}
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