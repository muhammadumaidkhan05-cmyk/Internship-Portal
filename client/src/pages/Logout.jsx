import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clearSession } from "../lib/session";

// ============================================================
// LOGOUT
// Shared by every role: clears the one session and returns the
// user to the single sign-in page.
// ============================================================

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearSession();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB]">
      <p className="text-sm text-[#64748B]">Signing you out...</p>
    </div>
  );
}

export default Logout;
