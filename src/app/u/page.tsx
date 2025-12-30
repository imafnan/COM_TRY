// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { rtdb } from "@/lib/firebase";
// import { ref, push, set } from "firebase/database";
// import {
//   UploadCloud,
//   Image as ImageIcon,
//   Video as VideoIcon,
//   X,
// } from "lucide-react";

// /* ---------------- TYPES ---------------- */
// type LocalPreview = {
//   id: string;
//   file: File;
//   previewUrl: string;
//   resource_type: "image" | "video";
//   progress: number;
//   uploading: boolean;
//   error: string | null;
// };

// type UploadedFile = {
//   url: string;
//   resource_type: string;
//   format: string | null;
//   name: string;
//   size: number;
//   uploadedAt: number;
// };

// /* ---------------- PAGE ---------------- */
// export default function UploadPage() {
//   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
//   const uploadPreset =
//     process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [viewLink, setViewLink] = useState("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [files, setFiles] = useState<LocalPreview[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const inputRef = useRef<HTMLInputElement>(null);

//   /* ---------------- CLEANUP ---------------- */
//   useEffect(() => {
//     return () => {
//       files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
//     };
//   }, []);

//   /* ---------------- HELPERS ---------------- */
//   const addFiles = (list: File[]) => {
//     const mapped = list.map((file) => ({
//       id: crypto.randomUUID(),
//       file,
//       previewUrl: URL.createObjectURL(file),
//       resource_type: file.type.startsWith("video")
//         ? "video"
//         : "image",
//       progress: 0,
//       uploading: false,
//       error: null,
//     }));
//     setFiles((p) => [...p, ...mapped]);
//   };

//   const uploadOne = (
//     preview: LocalPreview,
//     onProgress: (n: number) => void
//   ) =>
//     new Promise<any>((resolve, reject) => {
//       const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${preview.resource_type}/upload`;
//       const fd = new FormData();
//       fd.append("file", preview.file);
//       fd.append("upload_preset", uploadPreset);

//       const xhr = new XMLHttpRequest();
//       xhr.open("POST", endpoint);

//       xhr.upload.onprogress = (e) => {
//         if (e.lengthComputable) {
//           onProgress(
//             Math.round((e.loaded / e.total) * 100)
//           );
//         }
//       };

//       xhr.onload = () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           resolve(JSON.parse(xhr.responseText));
//         } else {
//           reject(new Error("Upload failed"));
//         }
//       };

//       xhr.onerror = () =>
//         reject(new Error("Network error"));
//       xhr.send(fd);
//     });

//   /* ---------------- MAIN UPLOAD ---------------- */
//   const startUpload = async () => {
//     if (!title.trim()) {
//       setError("Title is required");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file");
//       return;
//     }

//     setError(null);
//     const uploaded: UploadedFile[] = [];

//     for (const f of files) {
//       setFiles((p) =>
//         p.map((x) =>
//           x.id === f.id ? { ...x, uploading: true } : x
//         )
//       );

//       try {
//         const res = await uploadOne(f, (pct) => {
//           setFiles((p) =>
//             p.map((x) =>
//               x.id === f.id
//                 ? { ...x, progress: pct }
//                 : x
//             )
//           );
//         });

//         uploaded.push({
//           url: res.secure_url,
//           resource_type: res.resource_type,
//           format: res.format || null,
//           name: f.file.name,
//           size: f.file.size,
//           uploadedAt: Date.now(),
//         });
//       } catch (err: any) {
//         setError(err.message);
//         return;
//       }
//     }

//     await set(push(ref(rtdb, "casestudies")), {
//       title,
//       description,
//       viewLink,
//       tags,
//       files: uploaded,
//       createdAt: Date.now(),
//     });

//     /* RESET */
//     setTitle("");
//     setDescription("");
//     setViewLink("");
//     setTags([]);
//     setFiles([]);
//   };

//   /* ---------------- TAGS ---------------- */
//   const addTag = (v: string) => {
//     const t = v.trim();
//     if (t && !tags.includes(t))
//       setTags((p) => [...p, t]);
//   };

//   const removeTag = (t: string) =>
//     setTags((p) => p.filter((x) => x !== t));

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-6">
//         Add Case Study
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* -------- LEFT FORM -------- */}
//         <div className="bg-white border rounded-lg p-6">
//           <label className="block text-sm font-medium mb-1">
//             Title
//           </label>
//           <input
//             className="w-full border rounded px-3 py-2 mb-4"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <label className="block text-sm font-medium mb-1">
//             Description
//           </label>
//           <textarea
//             className="w-full border rounded px-3 py-2 mb-4 min-h-[120px]"
//             value={description}
//             onChange={(e) =>
//               setDescription(e.target.value)
//             }
//           />

//           <label className="block text-sm font-medium mb-1">
//             View Link
//           </label>
//           <input
//             className="w-full border rounded px-3 py-2 mb-4"
//             value={viewLink}
//             onChange={(e) => setViewLink(e.target.value)}
//           />

//           <label className="block text-sm font-medium mb-1">
//             Tags
//           </label>
//           <div className="border rounded px-3 py-2 flex flex-wrap gap-2">
//             {tags.map((t) => (
//               <span
//                 key={t}
//                 className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
//               >
//                 {t}
//                 <button
//                   onClick={() => removeTag(t)}
//                   className="ml-1 text-red-600"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//             <TagInputInline onAdd={addTag} />
//           </div>

//           {error && (
//             <div className="text-red-600 text-sm mt-3">
//               {error}
//             </div>
//           )}

//           <button
//             onClick={startUpload}
//             className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
//           >
//             Publish Case Study
//           </button>
//         </div>

//         {/* -------- RIGHT UPLOAD -------- */}
//         <div className="bg-white border rounded-lg p-6">
//           <div
//             className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
//             onClick={() => inputRef.current?.click()}
//           >
//             <UploadCloud className="mx-auto mb-2" />
//             <p className="text-sm">
//               Click or drop files here
//             </p>
//             <p className="text-xs text-gray-400">
//               Images & Videos
//             </p>
//             <input
//               ref={inputRef}
//               type="file"
//               multiple
//               accept="image/*,video/*"
//               className="hidden"
//               onChange={(e) =>
//                 addFiles(
//                   Array.from(e.target.files || [])
//                 )
//               }
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4 mt-4">
//             {files.map((f) => (
//               <div
//                 key={f.id}
//                 className="border rounded overflow-hidden"
//               >
//                 <div className="relative h-32 bg-gray-50">
//                   <button
//                     onClick={() =>
//                       setFiles((p) =>
//                         p.filter((x) => x.id !== f.id)
//                       )
//                     }
//                     className="absolute top-2 right-2 bg-white rounded p-1"
//                   >
//                     <X size={14} />
//                   </button>

//                   {f.resource_type === "video" ? (
//                     <video
//                       src={f.previewUrl}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <img
//                       src={f.previewUrl}
//                       className="w-full h-full object-cover"
//                     />
//                   )}
//                 </div>

//                 <div className="p-2 text-xs">
//                   <div className="truncate">
//                     {f.file.name}
//                   </div>
//                   <div className="h-2 bg-gray-100 rounded mt-1">
//                     <div
//                       className="h-2 bg-blue-600 rounded"
//                       style={{
//                         width: `${f.progress}%`,
//                       }}
//                     />
//                   </div>
//                   <div className="mt-1 flex justify-between text-gray-500">
//                     <span>
//                       {f.uploading
//                         ? `${f.progress}%`
//                         : "Ready"}
//                     </span>
//                     {f.resource_type === "video" ? (
//                       <VideoIcon size={14} />
//                     ) : (
//                       <ImageIcon size={14} />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- TAG INPUT ---------------- */
// function TagInputInline({
//   onAdd,
// }: {
//   onAdd: (v: string) => void;
// }) {
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

