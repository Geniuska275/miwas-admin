import React, { createContext, useContext, useState } from "react";

// -----------------------------------------------------------------------------
// MOCK AUTH. This checks against a hardcoded credential and stores a flag in
// localStorage — good enough to gate a demo dashboard, not good enough for
// production. For a real deployment, replace `login()` with a call to your
// backend's auth endpoint and store a real session token (ideally in an
// httpOnly cookie set by the server, not localStorage).
// -----------------------------------------------------------------------------

const DEMO_EMAIL = "info@meganet.com.ng";
const DEMO_PASSWORD = "meganet";
const SESSION_KEY = "vd_admin_session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const s = { email, loggedInAt: new Date().toISOString() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
      return { ok: true };
    }
    return { ok: false, error: "Incorrect email or password." };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
