
export interface MayaUser {
  uid: string;
  fullName: string;
  email: string;
  photoURL: string | null;
  studentId: string | null;

  referralCode: string;
  referredBy: string | null;

  emailVerified: boolean;

  plan: "free" | "premium";
  role: "student" | "admin";

  createdAt: number;
}
