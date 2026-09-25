import React, { useEffect, useMemo, useState } from "react";
import { getBookings, saveBookings, getServices, naira } from "../lib/storage.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";


import axios from "axios";
import { DownloadableImage, downloadImage } from "./download.jsx";
import handleDownload from "../components/download.jsx";
const STATUSES = ["Paid", "Pending", "Cancelled"];

export default function Nerd() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const baseUrl = "https://meganet-backend-q2fi.onrender.com/uploads/pdfs/"
  const baseUrl2 = "https://meganet-backend-q2fi.onrender.com/uploads/images/"

  useEffect(() => {
    fetchdata()
    setServices(getServices());
  }, []);
  const fetchdata = async () => {
    try {
      const data = await axios.get("https://meganet-backend-q2fi.onrender.com/api/nerd")
      console.log("data:", data?.data)
      setBookings(data?.data.data)
    } catch (error) {
      console.log(error)
    }
  }


  const serviceById = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), [services]);
  console.log("bookings:", bookings.data)
  const filtered = useMemo(() => {
    return bookings
      .filter((b) => statusFilter === "All" || b.status === statusFilter)
      .filter((b) => serviceFilter === "All" || b.serviceId === serviceFilter)
      .filter((b) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return b.first_choice.toLowerCase().includes(q) || b.second_choice.toLowerCase().includes(q);
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
        <h1 className="font-display text-2xl font-semibold text-brand-green-dark">Nerd</h1>
        <p className="text-sm opacity-60 mt-1">{filtered.length} of {bookings.length} Nerd</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or reference…"
          className="flex-1 min-w-[300px] px-4 py-2.5 rounded-lg bg-white outline-none text-sm border border-brand-green/20 focus:border-brand-green transition-colors"
        />

      </div>

      <div className="bg-white rounded-2xl border border-brand-green/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-brand-green/10 bg-brand-cream">
              <th className="px-5 py-3 font-semibold opacity-70">First Name</th>
              <th className="px-5 py-3 font-semibold opacity-70">Middlename</th>
              <th className="px-5 py-3 font-semibold opacity-70">Surname</th>
              <th className="px-5 py-3 font-semibold opacity-70">Sex</th>
              <th className="px-5 py-3 font-semibold opacity-70">Dob</th>
              <th className="px-5 py-3 font-semibold opacity-70">MaritalStatus </th>
              <th className="px-5 py-3 font-semibold opacity-70">NIN </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-brand-green/5 last:border-0 hover:bg-brand-cream/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-green-dark">{b.firstname}</p>
                </td>
                <td>
                  <p className="text-xs opacity-50">{b.middlename}</p>
                </td>
                <td className="px-5 py-3.5 opacity-80">{b.surname}</td>
                <td className="px-5 py-3.5 opacity-80"></td>
                <td className="px-5 py-3.5 opacity-60">{new Date(b.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td className="px-5 py-3.5 opacity-80">{b.MaritalStatus}</td>
                <td className="px-5 py-3.5 opacity-80">{b.nin}</td>



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
          <h1 style={{
            fontWeight: "bold"
          }}>CONTACT INFORMATION</h1>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="opacity-60">Nationality</span>
              <span className="font-semibold text-brand-green-dark">{selected.nationality}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">State of Origin</span>
              <span className="font-semibold text-brand-green-dark">{selected.State}</span>

              {/* <span className="font-semibold text-brand-green-dark">{naira(serviceById[selected.serviceId]?.price)}</span> */}
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">LGA</span>
              <span>{selected.Lga}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">City</span>
              <span>{selected.city}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Residential Address</span>
              <span>{selected.address}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Email Address</span>
              <span className="text-right">{selected.Email_address}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Phone Number</span>
              <span>{selected.PhoneNumber}</span>
            </div>

            <hr></hr>
            <h1 style={{
              fontWeight: "bold"
            }}>NEXT OF KIN</h1>

            <div className="flex items-center justify-between">
              <span className="opacity-60">Full Name</span>
              <span>{selected.FullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Phone Number</span>
              <span>{selected.Phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="opacity-60">Email Address</span>
              <span></span>
            </div>



            <hr></hr>
            <h1 style={{
              fontWeight: "bold"
            }}>ACADEMIC DATA</h1>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Institution</span>
              <span>{selected?.institution}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Faculty</span>
              <span>{selected.faculty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Department</span>
              <span>{selected?.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Programme Type</span>
              <span>{selected.programmeType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Matriculation Number</span>
              <span>{selected.MatricNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60">Course of Study</span>
              <span>{selected.Course}</span>
            </div>
            <div className="pt-3 border-t border-brand-green/10">
              <p style={{
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}>Download documents</p>
              <div className="">
                <h1 style={{
                  fontSize: "14px",
                  marginBottom: "10px",
                  marginTop: "10px",
                  fontWeight: "bold"

                }}>
                  Passport Photograph
                </h1>

                <img
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    marginBottom: "10px"
                  }}
                  src={baseUrl2 + selected.file.fileName} alt={selected.file.originalName} />

                <button
                  className="flex-1 px-3 py-2 mb-2 rounded-full text-xs font-semibold border transition-colors"
                  onClick={() => handleDownload(baseUrl2 + selected.file.fileName, selected.file.fileName)}
                >
                  download
                </button>
                <hr></hr>

                <div>

                  <h1 style={{
                    fontSize: "13px",
                    fontWeight: "bold"
                  }}>

                    NIN SLIP OR CARD
                  </h1>
                  <h1>{selected.file2.fileName}</h1>

                  <button
                    className="flex-1 px-3 py-2 mb-2 rounded-full text-xs font-semibold border transition-colors"
                    onClick={() => handleDownload(baseUrl + selected.file2.fileName, selected.file2.fileName)}
                  >
                    download
                  </button>
                </div>
                <hr></hr>
                <div>
                  <h1 style={{

                    fontSize: "13px",
                    fontWeight: "bold"

                  }}>

                    STATEMENT OF RESULT
                  </h1>
                  <h1>{selected.file3.fileName}</h1>

                  <button
                    className="flex-1 px-3 py-2 mb-2 rounded-full text-xs font-semibold border transition-colors"
                    onClick={() => handleDownload(baseUrl + selected.file3.fileName, selected.file3.fileName)}
                  >
                    download
                  </button>


                </div>
                <hr></hr>
                <div>
                  <h1 style={{

                    fontSize: "13px",
                    fontWeight: "bold"

                  }}>

                    PROJECT SOFT COPY PDF/DOC
                  </h1>
                  <h1>{selected?.file4?.fileName}</h1>

                  <button
                    className="flex-1 px-3 py-2 mb-2 rounded-full text-xs font-semibold border transition-colors"
                    onClick={() => handleDownload(baseUrl + selected?.file4?.fileName, selected?.file4?.fileName)}
                  >
                    download
                  </button>


                </div>
                <hr></hr>

                <div>

                  <h1 style={{

                    fontSize: "13px",
                    fontWeight: "bold"
                  }}>

                    SIGNED PROJECT CERTIFICATE PAGE
                  </h1>
                  <h1>{selected?.file5?.fileName}</h1>

                  <button
                    className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
                    onClick={() => handleDownload(baseUrl + selected?.file5?.fileName, selected?.file5?.fileName)}
                  >
                    download
                  </button>

                </div>
              </div>
            </div>


          </div>
        </Modal>
      )}
    </div>
  );
}
