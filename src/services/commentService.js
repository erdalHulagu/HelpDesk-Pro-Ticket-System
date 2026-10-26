
const API_BASE = "/api";

async function request(endpoint, token, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed.");
  }

  if (response.status === 204) return null;

  return response.json();
}

const commentService = {
  getByTicket(ticketId, token, signal) {
    return request(`/comments/ticket/${ticketId}`, token, {
      method: "GET",
      signal,
    });
  },

  getById(commentId, token) {
    return request(`/comments/${commentId}`, token);
  },

  create(comment, token) {
    return request("/comments", token, {
      method: "POST",
      body: JSON.stringify(comment),
    });
  },

 async uploadForComment(commentId, file, token) {
  const response = await fetch(
    `${API_BASE}/attachments/comment?commentId=${encodeURIComponent(commentId)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-File-Name": encodeURIComponent(file.name),
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "File upload failed.");
  }

  return response.json();
},
  delete(commentId, token) {
    return request(`/comments/${commentId}`, token, {
      method: "DELETE",
    });
  },
downloadAttachmentUrl(attachmentId) {
  return `${API_BASE}/attachments/${attachmentId}`;
},
async downloadAttachment(attachmentId, token, fileName) {
  const response = await fetch(
    `${API_BASE}/attachments/${attachmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to download attachment.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName || "attachment";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
},

};

export default commentService;