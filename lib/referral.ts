
import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

function generateReferralCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(8));

  const code = Array.from(values)
    .map((value) => characters[value % characters.length])
    .join("");

  return `MAYA${code}`;
}

export async function createUserProfile(user: User) {
  const userRef = doc(db, "users", user.uid);

  console.log("Starting profile creation for:", user.uid);

  for (let attempt = 0; attempt < 10; attempt++) {
    const referralCode = generateReferralCode();
    const referralRef = doc(db, "referralCodes", referralCode);

    try {
      const result = await runTransaction(db, async (transaction) => {
        // First check whether the user already has a profile.
        const userSnapshot = await transaction.get(userRef);

        if (userSnapshot.exists()) {
          const existingProfile = userSnapshot.data();

          // Check whether their referral document exists.
          const existingReferralRef = doc(
            db,
            "referralCodes",
            existingProfile.referralCode
          );

          const referralSnapshot = await transaction.get(
            existingReferralRef
          );

          if (!referralSnapshot.exists()) {
            console.log("Repairing missing referral document...");

            transaction.set(existingReferralRef, {
              uid: user.uid,
              createdAt: serverTimestamp(),
            });
          }

          return existingProfile;
        }

        // New user: check whether the generated code is available.
        const referralSnapshot = await transaction.get(referralRef);

        if (referralSnapshot.exists()) {
          return null;
        }

        const profile = {
          uid: user.uid,
          fullName: user.displayName || "Student",
          email: user.email || "",
          photoURL: user.photoURL || null,
          studentId: null,

          referralCode,
          referredBy: null,

          emailVerified: user.emailVerified,

          plan: "free",
          role: "student",

          createdAt: Date.now(),
        };

        // Create both documents atomically.
        transaction.set(userRef, profile);

        transaction.set(referralRef, {
          uid: user.uid,
          createdAt: serverTimestamp(),
        });

        return profile;
      });

      if (result) {
        console.log("SUCCESS: User profile:", result);
        console.log("SUCCESS: Referral code:", result.referralCode);

        return result;
      }
    } catch (error) {
      console.error("REFERRAL CREATION FAILED:", error);
      throw error;
    }
  }

  throw new Error("Could not generate a unique referral code.");
}
