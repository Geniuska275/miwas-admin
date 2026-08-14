import React, { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getBookings, getServices, naira } from "../lib/storage.js";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Overview() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
    setServices(getServices());
  }, []);

  const serviceById = useMemo(() => Object.fromEntries(services?.map((s) => [s.id, s])), [services]);

  const totalRevenue = useMemo(
    () => bookings.filter((b) => b.status === "Paid").reduce((sum, b) => sum + (serviceById[b.serviceId]?.price || 0), 0),
    [bookings, serviceById]
  );

  const paidCount = bookings.filter((b) => b.status === "Paid").length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => {
      const d = new Date(b.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [bookings]);

  const chartData = useMemo(
    () =>
      services.map((s) => ({
        name: s.title.length > 14 ? s.title.slice(0, 14) + "…" : s.title,
        revenue: bookings.filter((b) => b.serviceId === s.id && b.status === "Paid").reduce((sum) => sum + s.price, 0),
      })),
    [services, bookings]
  );

  const recent = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [bookings]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Overview</h1>
        <p className="text-sm opacity-60 mt-1">A snapshot of bookings and revenue across all services.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total revenue" value={naira(totalRevenue)} sub="From paid bookings" />
        <StatCard label="Total bookings" value={bookings.length} sub={`${thisMonthCount} this month`} accent="gold" />
        <StatCard label="Paid" value={paidCount} sub="Confirmed via Paystack" />
        <StatCard label="Pending" value={pendingCount} sub="Awaiting payment or follow-up" accent="gold" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-brand-green/10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Revenue by service</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00751815" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#12200f99" }} axisLine={{ stroke: "#00751822" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#12200f99" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  formatter={(v) => naira(v)}
                  contentStyle={{ borderRadius: 10, border: "1px solid #00751822", fontSize: 13 }}
                />
                <Bar dataKey="revenue" fill="#007518" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-brand-green/10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Recent bookings</p>
          <div className="space-y-4">
            {recent.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-green-dark truncate">{b.name}</p>
                  <p className="text-xs opacity-60 truncate">{serviceById[b.serviceId]?.title}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm opacity-50">No bookings yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
