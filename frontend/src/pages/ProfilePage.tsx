import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  updateProfile,
  type ProfileData,
} from "../services/profile.service";

import {
  getFollowers,
  getFollowing,
} from "../services/follow.service";

type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  location: string | null;
  website: string | null;
};

type Follower = {
  follower: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
    bio: string | null;
  };
};

type Following = {
  following: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
    bio: string | null;
  };
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [followers, setFollowers] = useState<Follower[]>(
    []
  );

  const [following, setFollowing] = useState<Following[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [loadingConnections, setLoadingConnections] =
    useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProfileData>({
    username: "",
    bio: "",
    avatar: "",
    location: "",
    website: "",
  });

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await getCurrentUser();

      setUser(response.data);

      setForm({
        username: response.data.username || "",
        bio: response.data.bio || "",
        avatar: response.data.avatar || "",
        location: response.data.location || "",
        website: response.data.website || "",
      });
    } catch (error: any) {
      console.error(
        "Failed to load profile:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadConnections(userId: number) {
    try {
      setLoadingConnections(true);

      const [followersResponse, followingResponse] =
        await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
        ]);

      setFollowers(followersResponse.data);
      setFollowing(followingResponse.data);
    } catch (error) {
      console.error(
        "Failed to load followers/following:",
        error
      );
    } finally {
      setLoadingConnections(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (user) {
      loadConnections(user.id);
    }
  }, [user]);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await updateProfile({
        username:
          form.username?.trim() || undefined,

        bio:
          form.bio?.trim() || undefined,

        avatar:
          form.avatar?.trim() || undefined,

        location:
          form.location?.trim() || undefined,

        website:
          form.website?.trim() || undefined,
      });

      setUser(response.data);
      setEditing(false);
    } catch (error: any) {
      console.error(
        "Failed to update profile:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center">
        Loading profile...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-600">
        {error || "Profile not found"}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile information */}
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {user.fullName}
            </h1>

            {user.username && (
              <p className="text-gray-500">
                @{user.username}
              </p>
            )}
          </div>

          <span className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-600">
            Your Profile
          </span>
        </div>

        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="mt-5 h-24 w-24 rounded-full object-cover"
          />
        )}

        {user.bio && (
          <p className="mt-4 text-gray-700">
            {user.bio}
          </p>
        )}

        {user.location && (
          <p className="mt-2 text-sm text-gray-500">
            📍 {user.location}
          </p>
        )}

        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-blue-600 hover:underline"
          >
            🌐 {user.website}
          </a>
        )}

        <button
          type="button"
          onClick={() =>
            setEditing((current) => !current)
          }
          className="mt-5 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
        >
          {editing
            ? "Cancel"
            : "Edit Profile"}
        </button>
      </div>

      {/* Followers / Following */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Followers */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Followers ({followers.length})
          </h2>

          {loadingConnections ? (
            <p className="text-sm text-gray-500">
              Loading followers...
            </p>
          ) : followers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No followers yet.
            </p>
          ) : (
            <div className="space-y-3">
              {followers.map((item) => {
                const follower =
                  item.follower;

                return (
                  <button
                    key={follower.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/users/${follower.id}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-gray-50"
                  >
                    {follower.avatar ? (
                      <img
                        src={follower.avatar}
                        alt={follower.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                        {follower.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {follower.fullName}
                      </p>

                      {follower.username && (
                        <p className="text-xs text-gray-500">
                          @{follower.username}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Following */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Following ({following.length})
          </h2>

          {loadingConnections ? (
            <p className="text-sm text-gray-500">
              Loading following...
            </p>
          ) : following.length === 0 ? (
            <p className="text-sm text-gray-500">
              Not following anyone yet.
            </p>
          ) : (
            <div className="space-y-3">
              {following.map((item) => {
                const followedUser =
                  item.following;

                return (
                  <button
                    key={followedUser.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/users/${followedUser.id}`
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-gray-50"
                  >
                    {followedUser.avatar ? (
                      <img
                        src={followedUser.avatar}
                        alt={followedUser.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                        {followedUser.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {followedUser.fullName}
                      </p>

                      {followedUser.username && (
                        <p className="text-xs text-gray-500">
                          @{followedUser.username}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit profile */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-bold">
            Edit Profile
          </h2>

          <input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            placeholder="Username"
            maxLength={30}
            className="mb-3 w-full rounded-lg border p-3"
          />

          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            placeholder="Bio"
            maxLength={300}
            rows={4}
            className="mb-3 w-full rounded-lg border p-3"
          />

          <input
            name="avatar"
            type="url"
            value={form.avatar || ""}
            onChange={handleChange}
            placeholder="Avatar URL"
            className="mb-3 w-full rounded-lg border p-3"
          />

          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            placeholder="Location"
            maxLength={100}
            className="mb-3 w-full rounded-lg border p-3"
          />

          <input
            name="website"
            type="url"
            value={form.website || ""}
            onChange={handleChange}
            placeholder="Website URL"
            className="mb-4 w-full rounded-lg border p-3"
          />

          {error && (
            <p className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}