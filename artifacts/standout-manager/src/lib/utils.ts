import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getToken() {
  return localStorage.getItem("standout_token");
}

export function setToken(token: string) {
  localStorage.setItem("standout_token", token);
}

export function removeToken() {
  localStorage.removeItem("standout_token");
}
