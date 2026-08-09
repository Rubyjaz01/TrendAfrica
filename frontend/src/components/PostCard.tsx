type Post = {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  author: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };
};

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-xl bg-white p-5 shadow">
      <div className="mb-3">
        <p className="font-semibold">
          {post.author.fullName}
        </p>

        {post.author.username && (
          <p className="text-sm text-gray-500">
            @{post.author.username}
          </p>
        )}
      </div>

      <p className="text-gray-800">
        {post.content}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </p>
    </article>
  );
}