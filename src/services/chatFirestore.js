import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

const db = getFirestore();

// Helper untuk mendapatkan ref koleksi pesan milik user yang sedang login (Aman dari null)
function getUserMessagesRef() {
  const user = getAuth().currentUser;
  if (!user) return null; // 👈 Ubah dari throw new Error menjadi return null
  return collection(db, "users", user.uid, "messages");
}

// 1. Ambil riwayat chat
export async function loadChatFromFirestore() {
  try {
    const messagesRef = getUserMessagesRef();
    if (!messagesRef) return []; // 👈 Amankan jika user belum siap

    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        role: data.role,
        text: data.text
      });
    });

    return messages;
  } catch (error) {
    console.error("Gagal memuat chat dari Firestore:", error);
    return [];
  }
}

// 2. Simpan 1 pesan baru
export async function saveMessageToFirestore(role, text) {
  try {
    const messagesRef = getUserMessagesRef();
    if (!messagesRef) return; // 👈 Amankan jika user belum siap

    await addDoc(messagesRef, {
      role: role,
      text: text,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Gagal menyimpan pesan ke Firestore:", error);
  }
}
