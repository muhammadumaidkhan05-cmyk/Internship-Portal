export const getLoggedInUserId = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return "";
  }

  try {
    const user = JSON.parse(savedUser);

    return user._id || user.id || "";
  } catch (error) {
    console.error("User data parse error:", error);
    return "";
  }
};