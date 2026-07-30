import { auth, db } from "./firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function uploadData(data) {
  const uid = auth.currentUser.uid;

  await setDoc(
    doc(db, "users", uid),
    data
  );
}

export async function downloadData() {
  const uid = auth.currentUser.uid;

  const snap = await getDoc(
    doc(db, "users", uid)
  );

  if (!snap.exists()) return null;

  return snap.data();
}