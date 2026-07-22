export async function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("surakshanet_token");
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = await getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res = await fetch(`http://127.0.0.1:8000${url}`, {
    ...options,
    headers,
  });

  // If unauthorized, token might be expired. Clear it and retry once.
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("surakshanet_token");
    token = await getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      res = await fetch(`http://127.0.0.1:8000${url}`, {
        ...options,
        headers,
      });
    }
  }

  return res;
}
