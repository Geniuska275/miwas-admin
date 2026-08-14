import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Overview", icon: "grid" },
  { to: "/business", label: "Business", icon: "list" },
  { to: "/ngos", label: "NGO", icon: "list" },
  { to: "/nerd", label: "NERD", icon: "list" },
  { to: "/nysc", label: "NYSC", icon: "list" },
  { to: "/personal", label: "PERSONAL", icon: "list" },
  { to: "/resume", label: "RESUME", icon: "list" },


  
];

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  if (name === "grid") return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
  if (name === "list") return <svg {...common}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
  if (name === "leaf") return <svg {...common}><path d="M11 20A7 7 0 0 1 4 13V6a1 1 0 0 1 1-1h7a7 7 0 0 1 7 7 7 7 0 0 1-8 8Z" /><path d="M4 6c6 0 12 4 12 12" /></svg>;
  if (name === "gear") return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" /></svg>;
  return null;
}

export default function Sidebar() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 shrink-0 bg-brand-green-dark text-brand-cream flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-lg font-semibold">
          MIWAS.
        </p>
        <p className="text-xs opacity-60 mt-0.5">Admin dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-brand-gold text-brand-green-dark" : "opacity-80 hover:opacity-100 hover:bg-white/5"
              }`
            }
          >
            <Icon name={l.icon} />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-xs opacity-60 mb-0.5">Signed in as</p>
        <p className="text-sm truncate mb-3">{session?.email}</p>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-brand-gold hover:opacity-80 transition-opacity"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
