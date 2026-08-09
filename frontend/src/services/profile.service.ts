import api from "../api/api";

export type ProfileData = {
  username?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
};

export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}

export async function updateProfile(
  data: ProfileData
) {
  const response = await api.put(
    "/auth/profile",
    data
  );

  return response.data;
}