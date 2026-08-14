import React, { useEffect, useState } from "react";
import { getServices, saveServices, naira } from "../lib/storage.js";
import Modal from "../components/Modal.jsx";

const BLANK = { eyebrow: "", title: "", desc: "", price: "", image: "" };

export default function Services() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null); // service object being edited, or BLANK for new
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    setServices(getServices());
  }, []);

  const openNew = () => setEditing({ ...BLANK, id: null });
  const openEdit = (s) => setEditing({ ...s });

  const update = (k) => (e) => setEditing({ ...editing, [k]: e.target.value });

  const save = () => {
    if (!editing.title.trim() || !editing.price) return;
    let next;
    if (editing.id) {
      next = services.map((s) => (s.id === editing.id ? { ...editing, price: Number(editing.price) } : s));
    } else {
      const id = editing.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `svc-${Date.now()}`;
      next = [...services, { ...editing, id, price: Number(editing.price) }];
    }
    setServices(next);
    saveServices(next);
    setEditing(null);
  };

  const remove = (id) => {
    const next = services.filter((s) => s.id !== id);
    setServices(next);
    saveServices(next);
    setConfirmDelete(null);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors";

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Services</h1>
          <p className="text-sm opacity-60 mt-1">Manage what's offered on the public site and its pricing.</p>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 rounded-full text-sm font-semibold bg-brand-gold text-brand-green-dark hover:brightness-95 transition"
        >
          + Add service
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-brand-green/10 overflow-hidden">
            <div className="h-28">
              <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-1">{s.eyebrow}</p>
              <p className="font-display font-semibold text-brand-green-dark mb-1">{s.title}</p>
              <p className="text-sm opacity-70 mb-3 line-clamp-2">{s.desc}</p>
              <p className="text-sm font-semibold text-brand-green mb-4">{naira(s.price)}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-cream transition-colors">
                  Edit
                </button>
                <button onClick={() => setConfirmDelete(s)} className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="opacity-50 text-sm">No services yet — add your first one.</p>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit service" : "New service"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Eyebrow / category</label>
              <input value={editing.eyebrow} onChange={update("eyebrow")} placeholder="e.g. Strategy" className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Title</label>
              <input value={editing.title} onChange={update("title")} placeholder="e.g. Agribusiness strategy" className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Description</label>
              <textarea value={editing.desc} onChange={update("desc")} rows={3} className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Price (₦)</label>
              <input type="number" value={editing.price} onChange={update("price")} placeholder="45000" className={inputClass} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Image URL</label>
              <input value={editing.image} onChange={update("image")} placeholder="https://…" className={inputClass} />
            </div>
            <button
              onClick={save}
              disabled={!editing.title.trim() || !editing.price}
              className="w-full px-6 py-3 rounded-full text-sm font-semibold bg-brand-gold text-brand-green-dark hover:brightness-95 transition disabled:opacity-50"
            >
              Save service
            </button>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete this service?" onClose={() => setConfirmDelete(null)} maxWidth="max-w-sm">
          <p className="text-sm opacity-70 mb-6">
            "{confirmDelete.title}" will be removed from this list. This can't be undone here.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold border border-brand-green/30">
              Cancel
            </button>
            <button onClick={() => remove(confirmDelete.id)} className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold bg-red-500 text-white">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
