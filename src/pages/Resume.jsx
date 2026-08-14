import React, { useEffect, useMemo, useState } from "react";
import { getBookings, saveBookings, getServices, naira } from "../lib/storage.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";

const STATUSES = ["Paid", "Pending", "Cancelled"];

export default function Resume() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setBookings(getBookings());
    setServices(getServices());
  }, []);

  const serviceById = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), [services]);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => statusFilter === "All" || b.status === statusFilter)
      .filter((b) => serviceFilter === "All" || b.serviceId === serviceFilter)
      .filter((b) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.reference.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, search, statusFilter, serviceFilter]);

  const updateStatus = (id, status) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(next);
    saveBookings(next);
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Bookings</h1>
        <p className="text-sm opacity-60 mt-1">{filtered.length} of {bookings.length} bookings</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or reference…"
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20"
        >
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20"
        >
          <option value="All">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-brand-green/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-brand-green/10 bg-brand-cream">
              <th className="px-5 py-3 font-semibold opacity-70">Name</th>
              <th className="px-5 py-3 font-semibold opacity-70">Service</th>
              <th className="px-5 py-3 font-semibold opacity-70">Price</th>
              <th className="px-5 py-3 font-semibold opacity-70">Date</th>
              <th className="px-5 py-3 font-semibold opacity-70">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-brand-green/5 last:border-0 hover:bg-brand-cream/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-green-dark">{b.name}</p>
                  <p className="text-xs opacity-50">{b.email}</p>
                </td>
                <td className="px-5 py-3.5 opacity-80">{serviceById[b.serviceId]?.title || b.serviceId}</td>
                <td className="px-5 py-3.5 opacity-80">{naira(serviceById[b.serviceId]?.price)}</td>
                <td className="px-5 py-3.5 opacity-60">{new Date(b.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</td>
                <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setSelected(b)} className="text-brand-green font-semibold text-xs hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center opacity-50">No bookings match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="opacity-60">Service</span>
              <span className="font-semibold text-brand-green-dark">{serviceById[selected.serviceId]?.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Fee</span>
              <span className="font-semibold text-brand-green-dark">{naira(serviceById[selected.serviceId]?.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Email</span>
              <span>{selected.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Phone</span>
              <span>{selected.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Preferred contact</span>
              <span>{selected.contactMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Farm / business size</span>
              <span className="text-right">{selected.farmSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Timeline</span>
              <span>{selected.timeline}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Location</span>
              <span>{selected.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Heard about us via</span>
              <span>{selected.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Reference</span>
              <span className="font-mono text-xs">{selected.reference}</span>
            </div>

            <div className="pt-3 border-t border-brand-green/10">
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Update status</p>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                    style={
                      selected.status === s
                        ? { backgroundColor: "#007518", color: "#fcfbfe", borderColor: "#007518" }
                        : { borderColor: "#00751833", color: "#12200f" }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
