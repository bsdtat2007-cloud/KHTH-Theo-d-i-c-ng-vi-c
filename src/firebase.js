// ==========================================================================
// CẤU HÌNH FIREBASE — điền thông tin dự án Firebase của Thu vào đây
// Xem hướng dẫn lấy thông tin này trong file HUONG-DAN-DEPLOY.md, Bước 2.
// ==========================================================================
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "DIEN_API_KEY_VAO_DAY",
  authDomain: "DIEN_AUTH_DOMAIN_VAO_DAY",
  projectId: "DIEN_PROJECT_ID_VAO_DAY",
  storageBucket: "DIEN_STORAGE_BUCKET_VAO_DAY",
  messagingSenderId: "DIEN_SENDER_ID_VAO_DAY",
  appId: "DIEN_APP_ID_VAO_DAY",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
