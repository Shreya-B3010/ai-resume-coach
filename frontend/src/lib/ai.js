const API_URL = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

export async function requestAI(path, payload) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}`,
    },
    body: JSON.stringify(payload),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "The AI request failed.");
  }

  return data;
}
