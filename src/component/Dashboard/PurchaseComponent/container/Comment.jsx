import React, { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { ContainerServices } from "../../../../services/Trip/container";

const Comment = ({ container_uuid }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

const fetchComments = async () => {
  if (!container_uuid) return;

  try {
    const res = await ContainerServices.commentList({ container_uuid });

    const commentsArray = Array.isArray(res.data?.record?.data)
      ? res.data.record.data
      : Array.isArray(res.data?.record)
      ? res.data.record
      : [];

    setComments(commentsArray);
  } catch (err) {
    console.error("Failed to fetch comments", err);
    setComments([]);
  }
};

  const submitComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      await ContainerServices.commentCreate({
        container_uuid,
        comment,
      });
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to create comment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [container_uuid]);

  return (
    <>
      {/* Comment box */}
      <div className="comment-box">
        <textarea
          placeholder="Add your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={submitComment} disabled={loading}>
          <SendHorizontal size={16} />
        </button>
      </div>

      {/* Comments list */}
      <div className="recent">
        <p className="recent-title">Recent</p>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((item, index) => (
            <div key={index} className="comment-item mb-3">
              <div className="user">
                <strong>
                  {item.creator_info
                    ? `${item.creator_info.firstname} ${item.creator_info.lastname}`
                    : "System"}
                </strong>
                <span>
                  {new Date(item.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text">{item.comment}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Comment
