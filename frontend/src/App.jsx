import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { API } from "./api";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [feed, setFeed] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);

    if (res.data.length > 0 && !currentUser) {
      setCurrentUser(res.data[0]._id);
    }
  };

  const fetchFeed = async (reset = false) => {
    if (!currentUser) return;

    const nextPage = reset ? 1 : page;

    const res = await API.get(
      `/posts/feed?userId=${currentUser}&page=${nextPage}&limit=5`
    );

    if (reset) {
      setFeed(res.data.posts);
    } else {
      setFeed((prev) => [...prev, ...res.data.posts]);
    }

    setHasMore(res.data.hasMore);
    setPage(nextPage + 1);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setPage(1);
      setHasMore(true);
      fetchFeed(true);
    }
  }, [currentUser]);

  // ✅ UPDATED: Create Post with Image Upload (Cloudinary)
  const handleCreatePost = async () => {
    if (!postText.trim()) return alert("Post text required!");

    let imageUrl = "";

    // Upload image first (if selected)
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      imageUrl = uploadRes.data.url;
    }

    // Create post with imageUrl
    await API.post("/posts/create", {
      userId: currentUser,
      text: postText,
      image: imageUrl,
    });

    setPostText("");
    setImageFile(null);

    setPage(1);
    fetchFeed(true);
  };

  const toggleLike = async (postId) => {
    await API.post(`/posts/${postId}/like`, { userId: currentUser });

    // refresh feed
    setPage(1);
    fetchFeed(true);
  };

  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    await API.post(`/posts/${postId}/comment`, {
      userId: currentUser,
      text,
    });

    // refresh feed
    setPage(1);
    fetchFeed(true);
  };

  const followUser = async (targetId) => {
    await API.post(`/users/${targetId}/follow`, { userId: currentUser });
    fetchUsers();
  };

  const unfollowUser = async (targetId) => {
    await API.post(`/users/${targetId}/unfollow`, { userId: currentUser });
    fetchUsers();
  };

  const currentUserObj = users.find((u) => u._id === currentUser);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>📱 Social Media Feed</h2>

      {/* Current User Select */}
      <div style={{ marginBottom: "15px" }}>
        <label>Select Current User: </label>
        <select
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        >
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} (@{u.username})
            </option>
          ))}
        </select>
      </div>

      {/* Follow/Unfollow Users */}
      <div style={{ marginBottom: "20px" }}>
        <h3>👥 Users</h3>
        {users
          .filter((u) => u._id !== currentUser)
          .map((u) => {
            const isFollowing = currentUserObj?.following?.includes(u._id);

            return (
              <div
                key={u._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              >
                <span>
                  <b>{u.name}</b> @{u.username}
                </span>

                {isFollowing ? (
                  <button onClick={() => unfollowUser(u._id)}>Unfollow</button>
                ) : (
                  <button onClick={() => followUser(u._id)}>Follow</button>
                )}
              </div>
            );
          })}
      </div>

      {/* Create Post */}
      <div style={{ marginBottom: "20px" }}>
        <h3>✍️ Create Post</h3>

        <textarea
          rows="3"
          style={{ width: "100%", padding: "10px" }}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Write something..."
        />

        {/* ✅ NEW: Image Input */}
        <div style={{ marginTop: "10px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile && (
            <p style={{ marginTop: "5px", color: "gray" }}>
              Selected: {imageFile.name}
            </p>
          )}
        </div>

        <button style={{ marginTop: "10px" }} onClick={handleCreatePost}>
          Post
        </button>
      </div>

      {/* Feed with Infinite Scroll */}
      <h3>📰 Feed</h3>

      <InfiniteScroll
        dataLength={feed.length}
        next={() => fetchFeed(false)}
        hasMore={hasMore}
        loader={<h4>Loading more posts...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>✅ No more posts</p>}
      >
        {feed.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={currentUser}
            toggleLike={toggleLike}
            addComment={addComment}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

function PostCard({ post, currentUser, toggleLike, addComment }) {
  const [commentText, setCommentText] = useState("");

  const isLiked = post.likes.includes(currentUser);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "15px",
      }}
    >
      <h4>
        {post.user.name}{" "}
        <span style={{ color: "gray" }}>@{post.user.username}</span>
      </h4>

      <p>{post.text}</p>

      {/* ✅ NEW: Show image if available */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        />
      )}

      <button style={{ marginTop: "10px" }} onClick={() => toggleLike(post._id)}>
        {isLiked ? "💔 Unlike" : "❤️ Like"} ({post.likes.length})
      </button>

      <div style={{ marginTop: "10px" }}>
        <h5>💬 Comments ({post.comments.length})</h5>

        {post.comments.map((c) => (
          <div key={c._id} style={{ padding: "6px 0" }}>
            <b>{c.user.name}:</b> {c.text}
          </div>
        ))}

        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <input
            style={{ flex: 1, padding: "8px" }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            onClick={() => {
              addComment(post._id, commentText);
              setCommentText("");
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
