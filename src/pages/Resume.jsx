import React, { useEffect, useMemo, useState } from "react";
import { getBookings, saveBookings, getServices, naira } from "../lib/storage.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";


import axios from "axios";
import { DownloadableImage, downloadImage } from "./download.jsx";
const STATUSES = ["Paid", "Pending", "Cancelled"];

export default function Resume() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const baseUrl="https://meganet-backend-q2fi.onrender.com/api/personal"
  useEffect(() => {
    fetchdata()  
    setServices(getServices());
  }, []);
   const fetchdata=async()=>{
     try {
      const data= await axios.get("https://meganet-backend-q2fi.onrender.com/api/resume")
      console.log("data:",data?.data)
      setBookings(data?.data.data)
     } catch (error) {
      console.log(error)
     }
   }


  const serviceById = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), [services]);
  console.log("bookings:",bookings.data)
  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return b.fullname.toLowerCase().includes(q) ;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, search]);

  const updateStatus = (id, status) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(next);
    saveBookings(next);
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Resume</h1>
        <p className="text-sm opacity-60 mt-1">{filtered.length} of {bookings.length} Resume</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search first choice or second choice"
          className="flex-1 min-w-[300px] px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors"
        />
       
       
      </div>

      <div className="bg-white rounded-2xl border border-brand-green/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-brand-green/10 bg-brand-cream">
              <th className="px-5 py-3 font-semibold opacity-70">Full Name</th>
              <th className="px-5 py-3 font-semibold opacity-70">Gender</th>
              <th className="px-5 py-3 font-semibold opacity-70">Dob</th>
              <th className="px-5 py-3 font-semibold opacity-70">LG Of Origin</th>
              <th className="px-5 py-3 font-semibold opacity-70">State Of Origin</th>
              <th className="px-5 py-3 font-semibold opacity-70">Phone Number</th>
              <th className="px-5 py-3 font-semibold opacity-70">Email Address</th>
              <th className="px-5 py-3 font-semibold opacity-70">Card Number</th>
              <th className="px-5 py-3 font-semibold opacity-70">Home Address</th>
              <th className="px-5 py-3 font-semibold opacity-70">Hobby</th>
              

              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-brand-green/5 last:border-0 hover:bg-brand-cream/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-green-dark">{b.fullname}</p>
                </td>


                <td>
                  <p className="text-xs opacity-50">{b.gender}</p>
                </td>
                <td className="px-5 py-3.5 opacity-60">{new Date(b.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short",year:"numeric" })}</td>

                 <td className="px-5 py-3.5 opacity-80">{b.l_origin}</td>
                <td className="px-5 py-3.5 opacity-80">{b.origin}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.phone_number}</td>
                <td className="px-5 py-3.5 opacity-80">{b.email_address}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.card_number}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.hobby}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.email_address}</td>  
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
        <Modal title={"RESUME"} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="opacity-60">Spoken</span>
              <span className="font-semibold text-brand-green-dark">{selected.spoken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">From</span>
              <span className="font-semibold text-brand-green-dark">{selected.pfrom}</span>

              {/* <span className="font-semibold text-brand-green-dark">{naira(serviceById[selected.serviceId]?.price)}</span> */}
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">TO</span>
              <span>{selected.pto}</span>
            </div>
            <h1>SECONDARY</h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">FROM</span>
              <span>{selected.sfrom}</span>
            </div>
            <h1>Director</h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">TO</span>
              <span>{selected.sto}</span>
            </div>
            <h1>Tertiary </h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">FROM</span>
              <span className="text-right">{selected.tfrom}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">TO</span>
              <span>{selected.tto}</span>    
            </div>

             <div className="flex items-center justify-between">
              <span className="opacity-60">Qualification</span>
              <span>{selected.qualification}</span>    
            </div>

             <div className="flex items-center justify-between">
              <span className="opacity-60">Tertiary Qualification</span>
              <span>{selected.tqualification}</span>    
            </div>

             <div className="flex items-center justify-between">
              <span className="opacity-60">Company</span>
              <span>{selected.company}</span>    
            </div>
             <div className="flex items-center justify-between">
              <span className="opacity-60">POST</span>
              <span>{selected.post}</span>    
            </div>

            <div className="flex items-center justify-between">
              <span className="opacity-60">POST</span>
              <span>{selected.to}</span>    
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">POST</span>
              <span>{selected.te}</span>    
            </div>
          

            
           
          </div>
        </Modal>
      )}
    </div>
  );
}
