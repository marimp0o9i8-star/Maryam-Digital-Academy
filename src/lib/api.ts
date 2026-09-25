import { firebaseAuth } from "./firebase";

/** Every private endpoint requires a fresh Firebase ID token. Do not cache user credentials in localStorage. */
export async function authenticatedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const user = firebaseAuth?.currentUser;
  if (!user) throw new Error("يرجى تسجيل الدخول الحقيقي أولاً.");
  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(path, { ...init, headers });
}

export async function apiJson<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await authenticatedFetch(path, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data as T;
}
