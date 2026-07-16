export type PaymentStatus = "pending" | "slip_uploaded" | "verified" | "rejected";

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  batch: string;
  payment_status: PaymentStatus;
  access_token: string;
  created_at: string;
}

export interface BookedSeat {
  id: string;
  registration_id: string;
  seat_no: string;
  created_at: string;
}

export interface PaymentSlip {
  id: string;
  registration_id: string;
  storage_path: string;
  uploaded_at: string;
}

export interface Ticket {
  id: string;
  registration_id: string;
  ticket_number: string;
  qr_token: string;
  issued_at: string;
  checked_in_at: string | null;
  checked_in_by: string | null;
}
