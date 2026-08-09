import { useEffect, useState } from "react";
import { getPosts } from "../services/post.service";
import PostCard from "../components/PostCard";

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

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await getPosts();

        console.log("Posts response:", response);

        setPosts(response.data);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return <p className="text-center">Loading posts...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold">
        TrendAfrica Feed
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          No posts available.
        </p>
      ) : (
        posts.map((post) => (
  <PostCard key={post.id} post={post} />
))
      )}
    </div>
  );
}