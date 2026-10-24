const API_BASE = "/api";

async function request(endpoint, token, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed.");
  }

  if (response.status === 204) {
    return null;
  }

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

  delete(commentId, token) {
    return request(`/comments/${commentId}`, token, {
      method: "DELETE",
    });
  },
};

export default commentService;
