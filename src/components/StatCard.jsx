import React from "react";

export default function StatCard({ label, value, sub, accent = "green" }) {
  const accentClass = accent === "gold" ? "text-brand-gold" : "text-brand-green";
  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-green/10">
      <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{label}</p>
      <p className="font-display text-3xl font-semibold text-brand-green-dark">{value}</p>
      {sub && <p className={`text-xs font-semibold mt-2 ${accentClass}`}>{sub}</p>}
    </div>
  );
}
