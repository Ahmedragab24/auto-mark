import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatMessageDate(date: Date) {
//   return new Intl.DateTimeFormat("ar", {
//     hour: "numeric",
//     minute: "numeric",
//   }).format(date);
// }
