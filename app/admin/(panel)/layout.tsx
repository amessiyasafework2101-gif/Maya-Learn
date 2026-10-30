
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   onAuthStateChanged,
//   getIdTokenResult,
//   signOut,
//   type User,
// } from "firebase/auth";

// import { auth } from "@/lib/firebase";
// import AdminSidebar from "@/components/admin/AdminSidebar";
// import AdminHeader from "@/components/admin/AdminHeader";
// import { Loader2, ShieldAlert } from "lucide-react";

// export default function AdminPanelLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [accessDenied, setAccessDenied] = useState(false);

//   useEffect(() => {
//     let active = true;

//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!active) return;

//       if (!currentUser) {
//         router.replace("/admin/login");
//         return;
//       }

//       try {
//         const tokenResult = await getIdTokenResult(currentUser, true);

//         if (!active) return;

//         if (tokenResult.claims.admin !== true) {
//           setAccessDenied(true);
//           await signOut(auth);

//           if (active) {
//             router.replace("/admin/login");
//           }

//           return;
//         }

//         setUser(currentUser);
//         setAccessDenied(false);
//         setChecking(false);
//       } catch (error) {
//         console.error("Admin access check failed:", error);

//         if (active) {
//           await signOut(auth);
//           router.replace("/admin/login");
//         }
//       }
//     });

//     return () => {
//       active = false;
//       unsubscribe();
//     };
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.replace("/admin/login");
//     } catch (error) {
//       console.error("Admin logout failed:", error);
//     }
//   };

//   if (checking || accessDenied || !user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#f7faef] px-4">
//         <div className="text-center">
//           {accessDenied ? (
//             <ShieldAlert
//               size={38}
//               className="mx-auto mb-3 text-red-500"
//             />
//           ) : (
//             <Loader2
//               size={36}
//               className="mx-auto mb-3 animate-spin text-[#4f862d]"
//             />
//           )}

//           <p className="text-sm font-medium text-[#214d32]">
//             {accessDenied
//               ? "Administrator access required"
//               : "Verifying administrator access..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f7faef]">
//       <AdminSidebar
//         open={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="min-h-screen lg:pl-72">
//         <AdminHeader
//           onMenuClick={() => setSidebarOpen(true)}
//           email={user.email}
//           onLogout={handleLogout}
//         />

//         <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  getIdTokenResult,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

const PREVIEW_MODE = process.env.NODE_ENV === "development";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (PREVIEW_MODE) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      try {
        const token = await getIdTokenResult(currentUser, true);

        if (token.claims.admin !== true) {
          await signOut(auth);
          router.replace("/admin/login");
          return;
        }

        setUser(currentUser);
        setAuthorized(true);
        setChecking(false);
      } catch (error) {
        console.error("Admin verification failed:", error);
        await signOut(auth);
        router.replace("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (PREVIEW_MODE) {
      router.replace("/admin/login");
      return;
    }

    await signOut(auth);
    router.replace("/admin/login");
  };

  if (checking || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faef]">
        <Loader2 className="animate-spin text-[#4f862d]" size={35} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faef]">
      {PREVIEW_MODE && (
        <div className="fixed bottom-4 right-4 z-[60] rounded-xl bg-amber-100 px-4 py-2 text-xs font-bold text-amber-800 shadow-lg">
          DEVELOPMENT PREVIEW ONLY
        </div>
      )}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          email={user?.email || "Preview Administrator"}
          onLogout={handleLogout}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
