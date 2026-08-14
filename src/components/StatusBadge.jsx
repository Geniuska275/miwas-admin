import React from "react";

const STYLES = {
  Paid: { bg: "#00751818", text: "#007518" },
  Pending: { bg: "#ffba0022", text: "#8a6400" },
  Cancelled: { bg: "#e5484822", text: "#c53030" },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || STYLES.Pending;
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}
