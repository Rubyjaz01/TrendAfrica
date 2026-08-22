import { useCallback, useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { getFeed } from "../services/post.service";

type Post = {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const response = await getFeed();

      console.log("Feed response:", response);

      setPosts(response.data);
    } catch (error) {
      console.error(
        "Failed to load feed:",
        error
      );

      setError("Failed to load feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function handlePostDeleted(postId: number) {
    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post.id !== postId
      )
    );
  }

  if (loading) {
    return (
      <p className="text-center">
        Loading feed...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">
        TrendAfrica Feed
      </h1>

      <CreatePost
        onPostCreated={loadPosts}
      />

      {error && (
        <p className="text-center text-red-600">
          {error}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500">
          No posts available.
        </p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostDeleted={handlePostDeleted}
          />
        ))
      )}
    </div>
  );
}