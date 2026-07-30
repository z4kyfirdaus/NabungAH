import { auth, db } from "./firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function uploadData(data) {
  if (!auth.currentUser) return; // 👈 Pengaman agar tidak crash

  const uid = auth.currentUser.uid;

  await setDoc(
    doc(db, "users", uid),
    data
  );
}

export async function downloadData() {
  if (!auth.currentUser) return null; // 👈 Pengaman agar tidak crash

  const uid = auth.currentUser.uid;

  const snap = await getDoc(
    doc(db, "users", uid)
  );

  if (!snap.exists()) return null;

  return snap.data();
}
