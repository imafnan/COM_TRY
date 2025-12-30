// "use client";

// import React, { useEffect, useState } from "react";
// import { rtdb } from "../../lib/firebase";
// import {
//   ref,
//   onValue,
//   remove,
//   update,
//   query,
//   orderByChild,
// } from "firebase/database";
// import { Trash2, ExternalLink } from "lucide-react";

// /* ---------------- TYPES ---------------- */
// type FileItem = {
//   url?: string;
//   resource_type?: string;
//   format?: string | null;
//   name?: string;
//   size?: number;
//   uploadedAt?: number;
// };

// type CaseStudyFromDB = {
//   title?: string;
//   description?: string;
//   viewLink?: string;
//   tags?: string[];
//   files?: FileItem[];
//   createdAt?: number;
// };

// type CaseStudyItem = {
//   id: string;
//   data: CaseStudyFromDB;
// };

// /* ---------------- PAGE ---------------- */
// export default function Page() {
//   const [items, setItems] = useState<CaseStudyItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [editOpen, setEditOpen] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [editData, setEditData] = useState<CaseStudyFromDB | null>(null);

//   /* ---------------- READ (REALTIME) ---------------- */
//   useEffect(() => {
//     setLoading(true);

//     const q = query(
//       ref(rtdb, "casestudies"),
//       orderByChild("createdAt")
//     );

//     const unsub = onValue(
//       q,
//       (snap) => {
//         const val = snap.val();
//         if (!val) {
//           setItems([]);
//           setLoading(false);
//           return;
//         }

//         const parsed: CaseStudyItem[] = Object.entries(val)
//           .map(([id, data]) => ({
//             id,
//             data: data as CaseStudyFromDB,
//           }))
//           .sort(
//             (a, b) =>
//               (b.data.createdAt || 0) -
//               (a.data.createdAt || 0)
//           );

//         setItems(parsed);
//         setLoading(false);
//       },
//       (err) => {
//         console.error(err);
//         setError("Failed to load case studies");
//         setLoading(false);
//       }
//     );

//     return () => unsub();
//   }, []);

//   /* ---------------- DELETE ---------------- */
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     await remove(ref(rtdb, `casestudies/${id}`));
//   };

//   /* ---------------- EDIT ---------------- */
//   const openEditModal = (id: string, data: CaseStudyFromDB) => {
//     setEditId(id);
//     setEditData({
//       title: data.title || "",
//       description: data.description || "",
//       viewLink: data.viewLink || "",
//       tags: data.tags ? [...data.tags] : [],
//       files: data.files ? [...data.files] : [],
//     });
//     setEditOpen(true);
//   };

//   const closeEditModal = () => {
//     setEditOpen(false);
//     setEditId(null);
//     setEditData(null);
//   };

//   const handleSave = async () => {
//     if (!editId || !editData) return;

//     await update(ref(rtdb, `casestudies/${editId}`), {
//       title: editData.title,
//       description: editData.description,
//       viewLink: editData.viewLink,
//       tags: editData.tags ?? [],
//     });

//     closeEditModal();
//   };

//   const addTag = (tag: string) => {
//     const t = tag.trim();
//     if (!t) return;
//     setEditData((p) =>
//       p ? { ...p, tags: [...(p.tags ?? []), t] } : p
//     );
//   };

//   const removeTag = (tag: string) => {
//     setEditData((p) =>
//       p
//         ? {
//             ...p,
//             tags: (p.tags ?? []).filter((x) => x !== tag),
//           }
//         : p
//     );
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">
//         Stored Case Studies
//       </h1>

//       {loading ? (
//         <div className="text-gray-500">Loading...</div>
//       ) : error ? (
//         <div className="text-red-600">{error}</div>
//       ) : items.length === 0 ? (
//         <div className="text-gray-500">No data found</div>
//       ) : (
//         <div className="grid gap-6">
//           {items.map((it) => {
//             const p = it.data;
//             const file = p.files?.[0]; // 👈 first media
//             const isVideo =
//               file?.resource_type === "video" ||
//               file?.url?.endsWith(".mp4");

//             return (
//               <div
//                 key={it.id}
//                 className="bg-white border rounded-lg p-4 flex gap-4"
//               >
//                 {/* MEDIA */}
//                 <div className="w-56 h-40 bg-gray-50 rounded overflow-hidden">
//                   {file?.url ? (
//                     isVideo ? (
//                       <video
//                         src={file.url}
//                         controls
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <img
//                         src={file.url}
//                         className="w-full h-full object-cover"
//                       />
//                     )
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-gray-400">
//                       No media
//                     </div>
//                   )}
//                 </div>

//                 {/* CONTENT */}
//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <div>
//                       <h2 className="text-lg font-medium">
//                         {p.title || "Untitled"}
//                       </h2>
//                       <div className="text-xs text-gray-500">
//                         {file?.uploadedAt
//                           ? new Date(
//                               file.uploadedAt
//                             ).toLocaleString()
//                           : "-"}
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       {p.viewLink && (
//                         <a
//                           href={p.viewLink}
//                           target="_blank"
//                           className="text-blue-600 underline text-sm flex items-center gap-1"
//                         >
//                           <ExternalLink size={14} /> View
//                         </a>
//                       )}
//                       <button
//                         onClick={() =>
//                           openEditModal(it.id, it.data)
//                         }
//                         className="text-green-600 text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(it.id)}
//                         className="text-red-600 text-sm"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </div>

//                   <p className="mt-2 text-sm text-gray-700">
//                     {p.description}
//                   </p>

//                   <div className="mt-2 flex gap-2 flex-wrap">
//                     {(p.tags ?? []).length > 0 ? (
//                       p.tags!.map((t) => (
//                         <span
//                           key={t}
//                           className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
//                         >
//                           {t}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-xs text-gray-400">
//                         No tags
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ---------------- EDIT MODAL ---------------- */}
//       {editOpen && editData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={closeEditModal}
//           />
//           <div className="bg-white rounded-lg p-6 z-10 w-full max-w-xl">
//             <h3 className="text-lg font-semibold mb-3">
//               Edit Case Study
//             </h3>

//             <input
//               className="border w-full p-2 mb-2"
//               value={editData.title}
//               onChange={(e) =>
//                 setEditData((p) => ({
//                   ...p!,
//                   title: e.target.value,
//                 }))
//               }
//             />

//             <textarea
//               className="border w-full p-2 mb-2"
//               value={editData.description}
//               onChange={(e) =>
//                 setEditData((p) => ({
//                   ...p!,
//                   description: e.target.value,
//                 }))
//               }
//             />

//             <input
//               className="border w-full p-2 mb-2"
//               value={editData.viewLink}
//               onChange={(e) =>
//                 setEditData((p) => ({
//                   ...p!,
//                   viewLink: e.target.value,
//                 }))
//               }
//             />

//             {/* TAGS */}
//             <div className="border p-2 flex flex-wrap gap-2 mb-4">
//               {(editData.tags ?? []).map((t) => (
//                 <span
//                   key={t}
//                   className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
//                 >
//                   {t}
//                   <button
//                     onClick={() => removeTag(t)}
//                     className="ml-2 text-red-600"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//               <TagInputInline onAdd={addTag} />
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeEditModal}
//                 className="border px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------------- TAG INPUT ---------------- */
// function TagInputInline({ onAdd }: { onAdd: (v: string) => void }) {
//   const [val, setVal] = useState("");
//   return (
//     <input
//       value={val}
//       onChange={(e) => setVal(e.target.value)}
//       onKeyDown={(e) => {
//         if (e.key === "Enter" || e.key === ",") {
//           e.preventDefault();
//           const t = val.replace(",", "").trim();
//           if (t) onAdd(t);
//           setVal("");
//         }
//       }}
//       placeholder="Add tag"
//       className="flex-1 outline-none text-sm"
//     />
//   );
// }
