import React, { useEffect, useMemo, useState } from "react";
import { getBookings, saveBookings, getServices, naira } from "../lib/storage.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";


import axios from "axios";
import { DownloadableImage, downloadImage } from "./download.jsx";
import PdfViewer from "../components/pdfviewer.jsx";
const STATUSES = ["Paid", "Pending", "Cancelled"];

export default function Personal() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const baseUrl="https://meganet-backend-q2fi.onrender.com/uploads/pdfs"
  useEffect(() => {
    fetchdata()  
    setServices(getServices());
  }, []);
   const fetchdata=async()=>{
     try {
      const data= await axios.get("https://meganet-backend-q2fi.onrender.com/api/personal")
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
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Personal</h1>
        <p className="text-sm opacity-60 mt-1">{filtered.length} of {bookings.length} Personal</p>
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
              <th className="px-5 py-3 font-semibold opacity-70">Email Address</th>
              <th className="px-5 py-3 font-semibold opacity-70">Phone Number</th>
              <th className="px-5 py-3 font-semibold opacity-70">Institution</th>
              <th className="px-5 py-3 font-semibold opacity-70">Study</th>
              <th className="px-5 py-3 font-semibold opacity-70">Destination</th>
              <th className="px-5 py-3 font-semibold opacity-70">Website </th>
              <th className="px-5 py-3 font-semibold opacity-70">Cost </th>


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
                  <p className="text-xs opacity-50">{b.Email_address}</p>
                </td>
                 <td className="px-5 py-3.5 opacity-80">{b.phone_number}</td>
                <td className="px-5 py-3.5 opacity-80">{b.institution}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.study}</td>
                <td className="px-5 py-3.5 opacity-80">{b.destination}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.website}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.cost}</td> 

                
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
        <Modal title={"Personal"} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="opacity-60">Full Name</span>
              <span className="font-semibold text-brand-green-dark">{selected.fullname}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Email Address</span>
              <span className="font-semibold text-brand-green-dark">{selected.Email_address}</span>

              {/* <span className="font-semibold text-brand-green-dark">{naira(serviceById[selected.serviceId]?.price)}</span> */}
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Phone Number</span>
              <span>{selected.phone_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Institution</span>
              <span>{selected.institution}</span>
            </div>
            <h1>Director</h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Study</span>
              <span>{selected.study}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Destination</span>
              <span className="text-right">{selected.destination}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Website</span>
              <span>{selected.website}</span>    
            </div>
          

            
            <div className="pt-3 border-t border-brand-green/10">
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Download Images</p>
              <div className="flex gap-2">
                <div>
                                            {/* <div>
                                               <img  style={{
                                                width:"80px",
                                                height:"80px",
                                                objectFit:"cover",
                                                marginBottom:"10px"
                                               }} src={baseUrl + selected.file.fileName} alt={selected.file.originalName} /> */}
                                  <PdfViewer url={baseUrl + selected.file.fileName}/>
                                  
                                             <a href={baseUrl+selected.file.fileName} download="report.pdf">
      
                                              <button
                                                  className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                                                  >download</button>
                                                                  </a>
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
