import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import { clearSession } from "../../lib/session";
function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearSession();

    navigate("/mentor/logged-out", { replace: true });
  }, [navigate]);

  return null;
}

export default Logout;
