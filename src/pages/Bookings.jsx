import React, { useEffect, useMemo, useState } from "react";
import { getBookings, saveBookings, getServices, naira } from "../lib/storage.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";


import axios from "axios";
import { DownloadableImage, downloadImage } from "./download.jsx";
const STATUSES = ["Paid", "Pending", "Cancelled"];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const baseUrl="https://meganet-backend-q2fi.onrender.com/uploads/images/"
  useEffect(() => {
    fetchdata()  
    setServices(getServices());
  }, []);
   const fetchdata=async()=>{
     try {
      const data= await axios.get("https://meganet-backend-q2fi.onrender.com/api/business")
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
        return b.first_choice.toLowerCase().includes(q) || b.second_choice.toLowerCase().includes(q);
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
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Business</h1>
        <p className="text-sm opacity-60 mt-1">{filtered.length} of {bookings.length} business</p>
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
              <th className="px-5 py-3 font-semibold opacity-70">First Choice</th>
              <th className="px-5 py-3 font-semibold opacity-70">Second Choice</th>
              <th className="px-5 py-3 font-semibold opacity-70">Business Address</th>
              <th className="px-5 py-3 font-semibold opacity-70">Company Nature</th>
              <th className="px-5 py-3 font-semibold opacity-70">Dob</th>
              <th className="px-5 py-3 font-semibold opacity-70">Phone Number</th>
              <th className="px-5 py-3 font-semibold opacity-70">Origin </th>
              <th className="px-5 py-3 font-semibold opacity-70">Card Number </th>

              <th className="px-5 py-3 font-semibold opacity-70">Home Address </th>
              <th className="px-5 py-3 font-semibold opacity-70">Local Origin </th>






              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-brand-green/5 last:border-0 hover:bg-brand-cream/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-green-dark">{b.first_choice}</p>
                </td>
                <td>
                  <p className="text-xs opacity-50">{b.second_choice}</p>
                </td>
                 <td className="px-5 py-3.5 opacity-80">{b.business_address}</td>
                <td className="px-5 py-3.5 opacity-80">{b.company_nature}</td> 
                <td className="px-5 py-3.5 opacity-60">{new Date(b.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</td>
                <td className="px-5 py-3.5 opacity-80">{b.phone_number}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.origin}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.card_number}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.home_address}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.l_origin}</td> 
                
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
              <span className="opacity-60">First_Choice</span>
              <span className="font-semibold text-brand-green-dark">{selected.first_choice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Second_Choice</span>
              <span className="font-semibold text-brand-green-dark">{selected.second_choice}</span>

              {/* <span className="font-semibold text-brand-green-dark">{naira(serviceById[selected.serviceId]?.price)}</span> */}
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Business Address</span>
              <span>{selected.business_address}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Company Nature</span>
              <span>{selected.company_nature}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Dob</span>
              <span>{selected.dob}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">phone_number</span>
              <span className="text-right">{selected.phone_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Origin</span>
              <span>{selected.origin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Card Number</span>
              <span>{selected.card_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Home Address</span>
              <span>{selected.home_address}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Local Govt Origin</span>
              <span className="font-mono text-xs">{selected.l_origin}</span>
            </div>

            <div className="pt-3 border-t border-brand-green/10">
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Download Images</p>
              <div className="flex gap-2">
                <div>
                   <img 
                   style={{
                    width:"80px",
                    height:"80px",
                    objectFit:"cover",
                    marginBottom:"10px"
                   }}
                   src={baseUrl + selected.file.fileName} alt={selected.file.originalName} />
                  <button
                                      className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                    
                   onClick={()=>{
                    const src=baseUrl + selected.file.fileName;
                       console.log(src)
                      downloadImage(src,selected.file.originalName)
                    }}>download</button>
                    <h1 style={{
                      textAlign:"center",
                      fontSize:"13px"
                    }}>
                      Passport Photograph
                    </h1>
                </div>
                <div>
                   <img 
                    style={{
                    width:"80px",
                    height:"80px",
                    objectFit:"cover",
                    marginBottom:"10px"
                   }}
                   src={baseUrl + selected.file2.fileName} alt={selected.file.originalName} />
                  <button
                                      className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                    
                   onClick={()=>{
                    const src=baseUrl + selected.file.fileName;
                       console.log(src)
                      downloadImage(src,selected.file.originalName)
                    }}>download</button>
                    <h1 style={{
                      textAlign:"center",
                      fontSize:"13px"
                    }}>
                      
                      Nin Slip
                    </h1>
                </div>
                <div>
                   <img  style={{
                    width:"80px",
                    height:"80px",
                    objectFit:"cover",
                    marginBottom:"10px"
                   }} src={baseUrl + selected.file3.fileName} alt={selected.file3.originalName} />
                  <button
                                      className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                    
                   onClick={()=>{
                    const src=baseUrl + selected.file3.fileName;
                       console.log(src)
                      downloadImage(src,selected.file3.originalName)
                    }}>download</button>
                    <h1 style={{
                      textAlign:"center",
                      fontSize:"13px"
                    }}>
                      
                      Signature
                    </h1>
                </div>
                {/* {STATUSES.map((s) => (
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
                ))} */}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
