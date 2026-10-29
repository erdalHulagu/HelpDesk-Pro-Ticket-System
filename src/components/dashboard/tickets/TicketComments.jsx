
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canWriteInternal = [
    "ADMIN",
    "IT_MANAGER",
    "IT_SUPPORT",
  ].includes(role);

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

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, submitting]);

  const commentCounts = comments.reduce((result, comment) => {
    const name = comment.authorUsername || "Unknown user";

    if (!result[name]) {
      result[name] = {
        name,
        role: comment.authorRole || "",
        count: 0,
      };
    }

    result[name].count += 1;
    return result;
  }, {});

  const authors = Object.values(commentCounts);

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

      const alreadySelected = files.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      );

      if (!alreadySelected) {
        allowedFiles.push(file);
      }
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

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!ticketId) return null;

  return (
    <section className="ticket-comments">
      <div className="rounded-xl border border-stone/60 bg-white p-3 dark:border-[#55595D] dark:bg-[#292D31]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-charcoal dark:text-ivory">
              Comments
            </h4>
            <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
              {loading
                ? "Loading comments..."
                : `${comments.length} ${comments.length === 1 ? "comment" : "comments"
                }`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setError("");
              setSuccess("");
            }}
            className="shrink-0 rounded-md bg-champagne px-2 py-1 text-[30px]  text-charcoal transition hover:opacity-90">
            View Comments
          </button>
        </div>

        {error && !isModalOpen && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && comments.length === 0 && !error && (
          <p className="mt-3 text-sm text-charcoal/60 dark:text-ivory/60 ">
            No comments yet.
          </p>
        )}

        {authors.length > 0 && (
          <div className="mt-3 space-y-2">
            {authors.map((author) => (
              <div
                key={author.name}
                className="flex items-center justify-between gap-3 rounded-lg bg-stone/10 px-3 py-2 dark:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal dark:text-ivory">
                    {author.name}
                  </p>
                  {author.role && (
                    <p className="text-xs text-charcoal/60 dark:text-ivory/60">
                      {author.role.replaceAll("_", " ")}
                    </p>
                  )}
                </div>

                <span className="shrink-0 rounded-full border border-champagne/40 px-2.5 py-1 text-xs font-semibold text-charcoal dark:text-ivory">
                  {author.count}{" "}
                  {author.count === 1 ? "comment" : "comments"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !submitting
            ) {
              setIsModalOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`comments-modal-title-${ticketId}`}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-stone/60 bg-white shadow-2xl dark:border-[#55595D] dark:bg-[#292D31]"
          >
            <header className="flex items-center justify-between gap-4 border-b border-stone/60 px-4 py-4 dark:border-[#55595D] sm:px-6">
              <div>
                <h2
                  id={`comments-modal-title-${ticketId}`}
                  className="text-lg font-semibold text-charcoal dark:text-ivory"
                >
                  Ticket Comments
                </h2>
                <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                aria-label="Close comments"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone/60 text-xl text-charcoal transition hover:bg-stone/10 disabled:opacity-50 dark:border-[#55595D] dark:text-ivory"
              >
                ×
              </button>
            </header>

            <div className="ticket-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              {success && (
                <p
                  role="status"
                  className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                >
                  {success}
                </p>
              )}

              {loading && (
                <p className="py-4 text-center text-sm text-charcoal/60 dark:text-ivory/60">
                  Loading comments...
                </p>
              )}

              {!loading && comments.length === 0 && !error && (
                <div className="rounded-xl border border-dashed border-stone/70 px-4 py-8 text-center dark:border-[#55595D]">
                  <p className="text-sm font-medium text-charcoal dark:text-ivory">
                    No comments yet
                  </p>
                  <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
                    Add the first comment below.
                  </p>
                </div>
              )}

              {comments.map((comment) => {
                const attachments = Array.isArray(comment.attachments)
                  ? comment.attachments
                  : [];

                return (
                  <article
                    key={comment.id}
                    className="rounded-xl border border-stone/60 p-4 dark:border-[#55595D]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/20 text-sm font-bold text-charcoal dark:text-ivory">
                          {(comment.authorUsername || "?")
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-charcoal dark:text-ivory">
                            {comment.authorUsername || "Unknown user"}
                          </p>
                          <p className="mt-0.5 text-xs text-charcoal/60 dark:text-ivory/60">
                            {(comment.authorRole || "User").replaceAll(
                              "_",
                              " "
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {comment.type === "INTERNAL" && (
                          <span className="mb-1 inline-block rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            Internal
                          </span>
                        )}
                        <p className="text-xs text-charcoal/50 dark:text-ivory/50">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>

                    {comment.content && (
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-charcoal/85 dark:text-ivory/85">
                        {comment.content}
                      </p>
                    )}

                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-charcoal/60 dark:text-ivory/60">
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
                              className="flex items-center justify-between gap-3 rounded-lg bg-stone/10 p-3 dark:bg-white/5"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span aria-hidden="true">
                                  {isImage
                                    ? "🖼️"
                                    : isPdf
                                      ? "📕"
                                      : "📎"}
                                </span>
                                <div className="min-w-0">
                                  <p className="break-words text-sm font-medium text-charcoal dark:text-ivory">
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
                                className="shrink-0 rounded-lg border border-stone/90 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-stone/50 dark:border-[#55595D] dark:text-ivory"
                              >
                                Download
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}

              <div className="border-t border-stone/60 pt-5 dark:border-[#55595D]">
                <h3 className="mb-3 text-sm font-semibold text-charcoal dark:text-ivory">
                  Add a comment
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <textarea
                    id={`comment-${ticketId}`}
                    value={content}
                    onChange={(event) => {
                      setContent(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    rows={4}
                    maxLength={5000}
                    placeholder="Write your comment..."
                    className="w-full rounded-lg border border-stone/70 bg-white p-3 text-sm text-charcoal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30 dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
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
                      className="rounded-lg border border-stone/70 px-3 py-2 text-xs font-medium text-charcoal hover:bg-stone/10 disabled:opacity-50 dark:border-[#55595D] dark:text-ivory"
                    >
                      📎 Attach photos or files
                    </button>

                    <span className="text-xs text-charcoal/60 dark:text-ivory/60">
                      Maximum 10 MB per file
                    </span>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-charcoal dark:text-ivory">
                        Selected files ({files.length})
                      </p>

                      {files.map((file, index) => (
                        <div
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-stone/50 p-2 dark:border-[#55595D]"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm text-charcoal dark:text-ivory">
                              {file.name}
                            </p>
                            <p className="text-xs text-charcoal/60 dark:text-ivory/60">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            disabled={submitting}
                            className="shrink-0 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {canWriteInternal && (
                    <label className="flex items-center gap-2 text-sm text-charcoal dark:text-ivory">
                      <input
                        type="checkbox"
                        checked={commentType === "INTERNAL"}
                        onChange={(event) =>
                          setCommentType(
                            event.target.checked ? "INTERNAL" : "PUBLIC"
                          )
                        }
                      />
                      Internal comment
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      (!content.trim() && files.length === 0)
                    }
                    className="w-full rounded-lg bg-champagne px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {submitting
                      ? "Sending..."
                      : files.length > 0
                        ? "Send Comment & Attachments"
                        : "Add Comment"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default TicketComments;