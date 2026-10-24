import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import commentService from "../../../services/commentService";

 const TicketComments=({ ticketId, token })=> {
  const role = useSelector((state) => state.auth.role);

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [commentType, setCommentType] = useState("PUBLIC");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canWriteInternal =
    role === "ADMIN" || role === "IT_MANAGER" || role === "IT_SUPPORT";

  const loadComments = useCallback(async (signal) => {
    if (!ticketId || !token) {
      setComments([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await commentService.getByTicket(
        ticketId,
        token,
        signal
      );

      if (!signal?.aborted) {
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) {
        setError(err.message || "Comments could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [ticketId, token]);

  useEffect(() => {
    const controller = new AbortController();
    loadComments(controller.signal);

    return () => controller.abort();
  }, [loadComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Please enter a comment.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await commentService.create(
        {
          content: content.trim(),
          ticketId,
          type: canWriteInternal ? commentType : "PUBLIC",
        },
        token
      );

      setContent("");
      setCommentType("PUBLIC");
      setSuccess("Comment added successfully.");

      await loadComments();
    } catch (err) {
      setError(err.message || "Unable to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ticketId) return null;

  return (
    <section className="ticket-comments">
      <h3 className="mb-3 text-sm font-semibold">Comments</h3>

      {loading && <p className="text-sm">Loading comments...</p>}

      {error && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mb-2 text-sm text-emerald-600">
          {success}
        </p>
      )}

      {!loading && comments.length === 0 && !error && (
        <p className="mb-3 text-sm text-charcoal/60 dark:text-ivory/60">
          No comments yet.
        </p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-lg border border-stone/50 p-3 dark:border-[#55595D]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <strong className="text-sm">
                  {comment.authorUsername || "Unknown user"}
                </strong>
                <p className="text-xs text-charcoal/60 dark:text-ivory/60">
                  {(comment.authorRole || "").replaceAll("_", " ")}
                </p>
              </div>

              <div className="text-right">
                {comment.type === "INTERNAL" && (
                  <span className="block text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Internal
                  </span>
                )}
                <small className="text-xs text-charcoal/60 dark:text-ivory/60">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString()
                    : ""}
                </small>
              </div>
            </div>

            <p className="mt-2 whitespace-pre-wrap break-words text-sm">
              {comment.content}
            </p>
          </article>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label htmlFor={`comment-${ticketId}`} className="block text-sm font-medium">
          Add a comment
        </label>

        <textarea
          id={`comment-${ticketId}`}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setError("");
            setSuccess("");
          }}
          rows={3}
          maxLength={5000}
          placeholder="Write your comment..."
          className="w-full rounded-lg border border-stone/70 bg-white p-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-champagne dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
          required
        />

        {canWriteInternal && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={commentType === "INTERNAL"}
              onChange={(event) =>
                setCommentType(event.target.checked ? "INTERNAL" : "PUBLIC")
              }
            />
            Internal comment (visible to support staff and management)
          </label>
        )}

        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-lg bg-champagne px-4 py-2 text-sm font-semibold text-charcoal transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Add Comment"}
        </button>
      </form>
    </section>
  );
}
export default TicketComments;