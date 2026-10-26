
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import commentService from "../../../services/commentService";

const TicketComments = ({ ticketId, token }) => {
  const role = useSelector((state) => state.auth.role);
  const fileInputRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [commentType, setCommentType] = useState("PUBLIC");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canWriteInternal =
    role === "ADMIN" ||
    role === "IT_MANAGER" ||
    role === "IT_SUPPORT";

  const loadComments = useCallback(
    async (signal) => {
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
    },
    [ticketId, token]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadComments(controller.signal);

    return () => controller.abort();
  }, [loadComments]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const maxFileSize = 10 * 1024 * 1024;
    const allowedFiles = [];
    const errors = [];

    for (const file of selectedFiles) {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: maximum file size is 10 MB.`);
        continue;
      }

      if (
        files.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        )
      ) {
        continue;
      }

      allowedFiles.push(file);
    }

    setFiles((previous) => [...previous, ...allowedFiles]);
    setError(errors.join(" "));
    setSuccess("");
    event.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim() && files.length === 0) {
      setError("Enter a comment or attach at least one file.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const createdComment = await commentService.create(
        {
          content: content.trim(),
          ticketId,
          type: canWriteInternal ? commentType : "PUBLIC",
        },
        token
      );

      if (files.length > 0) {
        const commentId = createdComment?.id;

        if (!commentId) {
          throw new Error(
            "Comment was created, but its ID was not returned."
          );
        }

        for (const file of files) {
          await commentService.uploadForComment(
            commentId,
            file,
            token
          );
        }
      }

      setContent("");
      setCommentType("PUBLIC");
      setFiles([]);
      setSuccess("Comment and attachments added successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadComments();
    } catch (err) {
      setError(
        err.message || "Unable to add comment or upload attachments."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (attachment) => {
    setError("");

    try {
      await commentService.downloadAttachment(
        attachment.id,
        token,
        attachment.fileName
      );
    } catch (err) {
      setError(err.message || "Unable to download attachment.");
    }
  };

  if (!ticketId) return null;

  return (
    <section className="ticket-comments">
      <h3 className="mb-3 text-sm font-semibold">Comments</h3>

      {loading && (
        <p className="text-sm">Loading comments...</p>
      )}

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
        {comments.map((comment) => {
          const attachments = Array.isArray(comment.attachments)
            ? comment.attachments
            : [];

          return (
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

              {comment.content && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                  {comment.content}
                </p>
              )}

              {attachments.length > 0 && (
                <div className="mt-3 space-y-3">
                  <p className="text-xs font-thin text-charcoal/70 dark:text-ivory/70">
                    Attachments ({attachments.length})
                  </p>

                  {attachments.map((attachment) => {
                    const fileName =
                      attachment.fileName || "Attachment";

                    const fileType =
                      attachment.fileType ||
                      attachment.contentType ||
                      "";

                    const isImage = fileType.startsWith("image/");
                    const isPdf =
                      fileType === "application/pdf" ||
                      fileName.toLowerCase().endsWith(".pdf");

                    return (
                      <div
                        key={attachment.id}
                        className="rounded-lg border border-stone/50 p-3 dark:border-[#55595D]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span aria-hidden="true" className="text-xl">
                              {isImage ? "🖼️" : isPdf ? "📕" : "📎"}
                            </span>

                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium">
                                {fileName}
                              </p>
                              <p className="text-xs text-charcoal/60 dark:text-ivory/60">
                                {fileType || "File"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownload(attachment)}
                            className="shrink-0 rounded-lg border border-stone/60 px-2 py-1 text-sm hover:bg-stone/10 dark:border-[#55595D]"
                          >
                            Download
                          </button>
                        </div>

                        {isImage && attachment.id && (
                          <p className="mt-2 text-xs text-charcoal/60 dark:text-ivory/60">
                            Use Download to view or save this image.
                          </p>
                        )}

                        {isPdf && (
                          <p className="mt-2 text-xs text-charcoal/60 dark:text-ivory/60">
                            PDF document · Download to open the file.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label
          htmlFor={`comment-${ticketId}`}
          className="block text-sm font-thin"
        >
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
        />

        <input
          ref={fileInputRef}
          id={`comment-files-${ticketId}`}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx,.log"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg border border-stone/70 px-1 py-0.5 text-xs font-thin transition hover:bg-stone/10 disabled:opacity-50 dark:border-[#55595D]"
          >
            <span aria-hidden="true ">📎</span>
            Attach photos or files
          </button>

          <span className="text-xs text-charcoal/60 dark:text-ivory/60">
            Maximum 10 MB per file
          </span>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Selected files ({files.length})
            </p>

            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-stone/50 p-2 dark:border-[#55595D]"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true">
                    {file.type.startsWith("image/") ? "🖼️" : "📄"}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm">{file.name}</p>
                    <p className="text-xs text-charcoal/60 dark:text-ivory/60">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={submitting}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {canWriteInternal && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={commentType === "INTERNAL"}
              onChange={(event) =>
                setCommentType(
                  event.target.checked ? "INTERNAL" : "PUBLIC"
                )
              }
            />
            Internal comment (visible to support staff and management)
          </label>
        )}

        <button
          type="submit"
          disabled={
            submitting || (!content.trim() && files.length === 0)
          }
          className="rounded-lg bg-champagne px-4 py-2 text-sm font-semibold text-charcoal transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Sending..."
            : files.length > 0
              ? "Send Comment & Attachments"
              : "Add Comment"}
        </button>
      </form>
    </section>
  );
};

export default TicketComments;