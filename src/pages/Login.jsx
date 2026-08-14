import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, DEMO_CREDENTIALS } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-semibold text-brand-green-dark">
            Verdant <span className="text-brand-gold">&amp;</span> Co.
          </p>
          <p className="text-sm opacity-60 mt-1">Admin dashboard</p>
        </div>

        <div className="bg-white rounded-2xl p-7 border border-brand-green/10">
          <p className="font-display text-lg font-semibold text-brand-green-dark mb-1">Sign in</p>
          <p className="text-sm opacity-60 mb-6">Use your admin credentials to continue.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@verdantandco.africa"
                className="w-full px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && submit(e)}
                className="w-full px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={submit}
              disabled={loading || !email || !password}
              className="w-full px-6 py-3 rounded-full text-sm font-semibold bg-brand-gold text-brand-green-dark hover:brightness-95 transition disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs opacity-50 leading-relaxed">
          Demo credentials — email <span className="font-semibold">{DEMO_CREDENTIALS.email}</span>, password{" "}
          <span className="font-semibold">{DEMO_CREDENTIALS.password}</span>. Replace this with real
          backend-verified auth before going live.
        </div>
      </div>
    </div>
  );
}
