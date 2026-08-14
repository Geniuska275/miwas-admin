import React, { useEffect, useMemo, useState } from "react";
import { getBookings, saveBookings, getServices, naira } from "../lib/storage.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";


import axios from "axios";
import { DownloadableImage, downloadImage } from "./download.jsx";
const STATUSES = ["Paid", "Pending", "Cancelled"];

export default function Nysc() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const baseUrl="https://meganet-backend-q2fi.onrender.com/api/nysc"
  useEffect(() => {
    fetchdata()  
    setServices(getServices());
  }, []);
   const fetchdata=async()=>{
     try {
      const data= await axios.get("https://meganet-backend-q2fi.onrender.com/api/nysc")
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
        return b.name.toLowerCase().includes(q);
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
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Nysc</h1>
        <p className="text-sm opacity-60 mt-1">{filtered.length} of {bookings.length} Nysc</p>
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
              <th className="px-5 py-3 font-semibold opacity-70">name</th>
              <th className="px-5 py-3 font-semibold opacity-70">Email Address</th>
              <th className="px-5 py-3 font-semibold opacity-70">Nin</th>
              <th className="px-5 py-3 font-semibold opacity-70">dob</th>
              <th className="px-5 py-3 font-semibold opacity-70">State</th>
              <th className="px-5 py-3 font-semibold opacity-70">Local Govt of Origin</th>
              <th className="px-5 py-3 font-semibold opacity-70">Address </th>
              <th className="px-5 py-3 font-semibold opacity-70">State Before </th>
              <th className="px-5 py-3 font-semibold opacity-70">Blood Group</th>
              <th className="px-5 py-3 font-semibold opacity-70">Genotype </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-brand-green/5 last:border-0 hover:bg-brand-cream/60 transition-colors">  
                <td>
                  <p className="text-xs opacity-50 px-5 py-3.5">{b.name}</p>
                </td>
                 <td className="px-5 py-3.5 opacity-80">{b.Email_address}</td>
                <td className="px-5 py-3.5 opacity-80">{b.nin}</td> 
                <td className="px-5 py-3.5 opacity-60">{new Date(b.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" ,year:"numeric"})}</td>
                <td className="px-5 py-3.5 opacity-80">{b.state}</td>
                <td className="px-5 py-3.5 opacity-80">{b.lgo}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.address}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.stateBefore}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.bloodgroup}</td> 
                <td className="px-5 py-3.5 opacity-80">{b.genotype}</td> 

                
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setSelected(b)} className="text-brand-green font-semibold text-xs hover:underline">
                    View more
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
        <Modal title={"NYSC REGISTRATION"} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="opacity-60">Registration Number</span>
              <span className="font-semibold text-brand-green-dark">{selected.registration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Matric Number</span>
              <span className="font-semibold text-brand-green-dark">{selected.matric}</span>

              {/* <span className="font-semibold text-brand-green-dark">{naira(serviceById[selected.serviceId]?.price)}</span> */}
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">place</span>
              <span>{selected.place}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Language</span>
              <span>{selected.language}</span>
            </div>
            <h1>Primary School</h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">From</span>
              <span>{selected.pfrom}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">To</span>
              <span className="text-right">{selected.pto}</span>
            </div>
            <h1>Secondary School</h1>
              <div className="flex items-center justify-between">
              <span className="opacity-60">To</span>
              <span>{selected.secto}</span>
            </div>
            <h1>Tertiary</h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">From</span>
              <span className="text-right">{selected.tetfrom}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">To</span>
              <span className="text-right">{selected.tetto}</span>
            </div>
            
            <h1>next of kin</h1>

            <div className="flex items-center justify-between">
              <span className="opacity-60">Relationship</span>
              <span>{selected.kinRelationship}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Name</span>
              <span className="text-right">{selected.kinName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Email</span>
              <span className="text-right">{selected.kinEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Phone Number</span>
              <span>{selected.kinPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Shirt Size</span>
              <span>{selected.shirt}</span>
            </div>

             <div className="flex items-center justify-between">
              <span className="opacity-60">Trouser Size</span>
              <span>{selected.trouser}</span>
            </div> <div className="flex items-center justify-between">
              <span className="opacity-60">Shoe Size</span>
              <span>{selected.shoe}</span>
            </div>


            
            <div className="pt-3 border-t border-brand-green/10">
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Download Images</p>
              <div className="flex gap-2">
                <div>
                 <img src={baseUrl + selected.file.path} alt={selected.file.originalName} />
                 
                  <button
                                      className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                    
                   onClick={()=>{
                    const src=baseUrl + selected.file.path;
                       
                      downloadImage(src,selected.file.originalName)
                    }}>download</button>
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
