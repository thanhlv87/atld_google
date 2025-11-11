import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Cấu trúc cho một mục đào tạo chi tiết
export interface TrainingDetail {
    type: string;
    group: string; // e.g., "Nhóm 1 (NĐ 44)" or "Không áp dụng"
    participants: number;
}

export interface TrainingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  trainingDetails: TrainingDetail[]; // Mảng các chi tiết đào tạo
  trainingDuration: string; // Thời gian huấn luyện dự kiến
  preferredTime: string; // Thời điểm huấn luyện dự kiến
  description: string;
  location: string;
  createdAt: firebase.firestore.Timestamp;
  viewedBy: string[]; // Array of user UIDs who have viewed the contact info
}

export interface PartnerProfile {
    uid: string;
    email: string;
    taxId: string;
    address: string;
    phone: string;
    notableClients: string;
    capabilities: string[];
    subscribesToEmails: boolean;
    status: 'pending' | 'approved' | 'rejected';
    membership: 'free' | 'premium';
}

export interface Document {
  id: string;
  title: string;
  description: string;
  downloadUrl: string;
  fileName: string;
  createdAt: firebase.firestore.Timestamp;
}

// Hằng số cho các nhóm đào tạo trong form
export const TRAINING_GROUPS = [
    "Không áp dụng",
    "Nhóm 1 (NĐ 44)",
    "Nhóm 2 (NĐ 44)",
    "Nhóm 3 (NĐ 44)",
    "Nhóm 4 (NĐ 44)",
    "Nhóm 5 (NĐ 44)",
    "Nhóm 6 (NĐ 44)",
];

export const DECREE_44_GROUPS = [ // Giữ lại để tham khảo
    "Đào tạo Nhóm 1 (NĐ 44)",
    "Đào tạo Nhóm 2 (NĐ 44)",
    "Đào tạo Nhóm 3 (NĐ 44)",
    "Đào tạo Nhóm 4 (NĐ 44)",
    "Đào tạo Nhóm 5 (NĐ 44)",
    "Đào tạo Nhóm 6 (NĐ 44)",
];

// For clients to choose from when creating a request
export const TRAINING_TYPES = [
    "An toàn điện",
    "An toàn xây dựng",
    "An toàn hóa chất",
    "Phòng cháy chữa cháy (PCCC)",
    "An toàn vận hành thiết bị nâng",
    "An toàn làm việc trên cao",
    "Sơ cấp cứu",
    "Khác (Vui lòng ghi rõ)"
];

// For partners to select their capabilities during registration
export const PARTNER_CAPABILITIES = [
    "An toàn điện",
    "An toàn xây dựng",
    "An toàn hóa chất",
    "Phòng cháy chữa cháy (PCCC)",
    "An toàn vận hành thiết bị nâng",
    "An toàn làm việc trên cao",
    "Sơ cấp cứu",
    "Huấn luyện chung (Nhiều lĩnh vực)",
];