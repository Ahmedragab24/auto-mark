let csrfToken: string | null = null;

export async function refreshCsrfToken() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("BASE_URL environment variable is not defined");
      return false;
    }

    const apiUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

    const response = await fetch(`${apiUrl}sanctum/csrf-cookie`, {
      method: "GET",
      // credentials: "include", // ⬅️ تأكد من إرسال الكوكيز
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`CSRF request failed with status: ${response.status}`);
      return false;
    }

    // تأكيد تحديث الـ CSRF token
    csrfToken = getCsrfToken();
    return true;
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error);
    return false;
  }
}

export function getCsrfToken(): string | null {
  if (typeof window === "undefined") return null; // التأكد من أننا على العميل

  if (csrfToken) return csrfToken;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token) {
    csrfToken = decodeURIComponent(token);
  }

  return csrfToken;
}

export function setCsrfToken(token: string) {
  csrfToken = token;
}
