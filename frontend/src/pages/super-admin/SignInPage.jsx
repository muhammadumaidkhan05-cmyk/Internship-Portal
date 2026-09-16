import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "../../api/useAuth";

const ROLES = [
  {
    role: "super_admin",
    label: "Super Admin",
    description: "System-wide management, roles, audit logs.",
    destination: "/super-admin",
    color: "#F59E0B",
    colorEnd: "#F97316",
  },
  {
    role: "program-manager",
    label: "Program Manager",
    description: "Manage cohorts, mentors, reports and announcements.",
    destination: "/program-manager/dashboard",
    color: "#3B82F6",
    colorEnd: "#6366F1",
  },
  {
    role: "project-manager",
    label: "Project Manager",
    description: "Manage projects, tasks, team and scrum reviews.",
    destination: "/project-manager",
    color: "#10B981",
    colorEnd: "#06B6D4",
  },
];

export default function SignInPage() {
  const navigate = useNavigate();
  const { mutate: signIn, isPending } = useSignIn();
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState(null);

  const handleSelectRole = (role, destination) => {
    setSelectedRole(role);
    setError(null);
    signIn(
      { role },
      {
        onSuccess: () => {
          navigate(destination);
        },
        onError: (err) => {
          setError(err?.message || "Sign-in failed. Please try again.");
          setSelectedRole(null);
        },
      }
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        padding: "1rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#1E293B",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
              display: "grid",
              placeItems: "center",
              fontWeight: "700",
              fontSize: "1rem",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            M
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#F8FAFC",
                letterSpacing: "0.05em",
              }}
            >
              MSN ACADEMY | IMP
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Internship Management Portal
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "1.25rem",
              lineHeight: 1.6,
            }}
          >
            Select your role to access your dashboard.
          </p>

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#FCA5A5",
                fontSize: "0.8rem",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {ROLES.map((r) => {
              const isLoading = isPending && selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSelectRole(r.role, r.destination)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.875rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending && selectedRole !== r.role ? 0.5 : 1,
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    gap: "1rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        background: `linear-gradient(135deg, ${r.color} 0%, ${r.colorEnd} 100%)`,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#F1F5F9",
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.45)",
                          marginTop: "0.1rem",
                        }}
                      >
                        {r.description}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: r.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isLoading ? "Entering..." : "Enter →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
