import { UserDataState } from "@/store/features/userData";

const STORAGE_KEY = "userDataAutoMark";

// Get the user data from sessionStorage
export const getUserData = (): UserDataState | null => {
  if (typeof window !== "undefined") {
    const userData = sessionStorage.getItem(STORAGE_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }
  return null;
};

/**
 *
 * @param data
 */

// Set the user data in sessionStorage
export const setUserData = (data: UserDataState) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

// Delete the user data from sessionStorage
export const removeUserData = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
};
