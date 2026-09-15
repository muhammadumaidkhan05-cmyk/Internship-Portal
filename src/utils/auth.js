export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to read user from localStorage:", error);
    return null;
  }
}

export function getCurrentUserId() {
  const user = getCurrentUser();
  return user?._id || null;
}