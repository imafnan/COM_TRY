// import React from 'react';

// import gr from  '../public/gr.png'
// import gr1 from '../public/gr1.png'
// import op from '../public//op.png'
// import ro from '../public/ro.png'
// import er from '../public/er.png'
// import Image from 'next/image';

// const Anan = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      
//       <div className="relative w-full max-w-4xl mx-auto text-center">
//         {/* Background Gears - Decorative */}
//         <Image  
//           src={gr}
//           alt="gear" 
//           className="absolute left-10 bottom-20 w-16 h-16 md:w-20 md:h-20 animate-spin-slow opacity-70"
//         />
//         <Image
//           src={gr1} 
//           alt="gear" 
//           className="absolute left-20 bottom-10 w-12 h-12 md:w-16 md:h-16 animate-spin-reverse opacity-60"
//         />

//         {/* Main Content */}
//         <div className="relative z-10">
//           {/* 404 Text */}
//           <div className="mb-6">
//             <Image 
//               src={er} 
//               alt="404" 
//               className="mx-auto w-48 h-auto md:w-64"
//             />
//           </div>

        

//           {/* Robot with Map */}
//           <div className="relative inline-block">
//             <Image 
//               src={ro} 
//               alt="Lost Robot" 
//               className="w-48 h-auto md:w-64 mx-auto"
//             />
          
//           </div>

//           {/* Oops Badge */}
//           <div className="absolute top-16 right-10 md:top-20 md:right-16">
//             <Image 
//               src={op} 
//               alt="Oops!" 
//               className="w-20 h-auto md:w-28 animate-bounce"
//             />
//           </div>

//           {/* Back to Home Button */}
//           <div className="mt-12">
//             <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
//               Back To Home
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Custom Animations */}
//       <style jsx>{`
//         @keyframes spin-slow {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes spin-reverse {
//           from {
//             transform: rotate(360deg);
//           }
//           to {
//             transform: rotate(0deg);
//           }
//         }

//         .animate-spin-slow {
//           animation: spin-slow 10s linear infinite;
//         }

//         .animate-spin-reverse {
//           animation: spin-reverse 8s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Anan;