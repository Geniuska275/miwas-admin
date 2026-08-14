import React, { useEffect, useState } from "react";
import { getSettings, saveSettings, resetAllData } from "../lib/storage.js";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setForm(getSettings());
  }, []);

  if (!form) return null;

  const update = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setSaved(false);
  };

  const save = () => {
    saveSettings(form);
    setSaved(true);
  };

  const doReset = () => {
    resetAllData();
    window.location.reload();
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors";

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Settings</h1>
        <p className="text-sm opacity-60 mt-1">Business details shown on the public site, and payment configuration.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-brand-green/10 space-y-4 mb-6">
        <div>
          <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Business name</label>
          <input value={form.businessName} onChange={update("businessName")} className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Address</label>
          <input value={form.address} onChange={update("address")} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Email</label>
            <input value={form.email} onChange={update("email")} className={inputClass} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Phone</label>
            <input value={form.phone} onChange={update("phone")} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest opacity-60 block mb-1.5">Paystack public key</label>
          <input value={form.paystackPublicKey} onChange={update("paystackPublicKey")} className={inputClass + " font-mono"} />
          <p className="text-xs opacity-50 mt-1.5">
            Public key only (starts with pk_). Never enter your secret key (sk_…) here or anywhere in frontend code.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} className="px-6 py-2.5 rounded-full text-sm font-semibold bg-brand-gold text-brand-green-dark hover:brightness-95 transition">
            Save changes
          </button>
          {saved && <span className="text-sm text-brand-green font-semibold">Saved.</span>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-red-200">
        <p className="font-semibold text-red-600 mb-1">Reset demo data</p>
        <p className="text-sm opacity-60 mb-4">
          Clears bookings, services and settings stored in this browser and restores the seed data.
        </p>
        {confirmReset ? (
          <div className="flex gap-3">
            <button onClick={() => setConfirmReset(false)} className="px-5 py-2 rounded-full text-sm font-semibold border border-brand-green/30">
              Cancel
            </button>
            <button onClick={doReset} className="px-5 py-2 rounded-full text-sm font-semibold bg-red-500 text-white">
              Yes, reset everything
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="px-5 py-2 rounded-full text-sm font-semibold border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
            Reset data
          </button>
        )}
      </div>
    </div>
  );
}
