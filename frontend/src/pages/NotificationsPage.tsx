import { useEffect, useState } from "react";
import api from "../api/api";

type Notification = {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  actor?: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  } | null;
  post?: {
    id: number;
    content: string;
  } | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      console.log(
        "FULL API RESPONSE:",
        response.data
      );

      setNotifications(response.data.data);
    } catch (error: any) {
      console.error(
        "Failed to load notifications:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(
    notificationId: number
  ) {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  async function markAllAsRead() {
    try {
      await api.put(
        "/notifications/read-all"
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  function getNotificationIcon(type: string) {
    switch (type) {
      case "LIKE":
        return "❤️";

      case "COMMENT":
        return "💬";

      case "FOLLOW":
        return "👤";

      default:
        return "🔔";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-gray-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Notifications
        </h1>

        {notifications.some(
          (notification) => !notification.read
        ) && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
          {error}
        </p>
      )}

      {/* No notifications */}
      {notifications.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-center">
          <p className="text-gray-500">
            You have no notifications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">

          {notifications.map(
            (notification) => (
              <button
                type="button"
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(
                      notification.id
                    );
                  }
                }}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  notification.read
                    ? "bg-white"
                    : "bg-blue-50 hover:bg-blue-100"
                }`}
              >

                <div className="flex gap-3">

                  {/* Icon */}
                  <div className="text-2xl">
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  {/* Notification content */}
                  <div className="flex-1">

                    <p
                      className={
                        notification.read
                          ? "text-gray-700"
                          : "font-semibold text-gray-900"
                      }
                    >
                      {notification.message}
                    </p>

                    {/* Actor */}
                    {notification.actor && (
                      <p className="mt-1 text-sm text-gray-500">
                        From:{" "}
                        {notification.actor.fullName}

                        {notification.actor
                          .username &&
                          ` (@${notification.actor.username})`}
                      </p>
                    )}

                    {/* Date */}
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(
                        notification.createdAt
                      )}
                    </p>

                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <span className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                  )}

                </div>

              </button>
            )
          )}

        </div>
      )}
    </div>
  );
}