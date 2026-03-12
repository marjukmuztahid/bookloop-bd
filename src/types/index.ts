export type Curriculum = 'bangla_version' | 'english_version' | 'english_medium';
export type BookCondition = 'new' | 'good' | 'fair' | 'worn';
export type ListingStatus = 'pending' | 'available' | 'sold' | 'rejected';
export type OrderStatus = 'pending' | 'approved' | 'pickup_scheduled' | 'in_transit' | 'delivered' | 'unsuccessful' | 'cancelled';

export interface User {
  id: string;
  full_name: string;
  phone: string;
  district: string;
  bkash_nagad_number: string | null;
  is_banned: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  book_name: string;
  author_publisher: string;
  curriculum: Curriculum;
  class_level: string;
  condition: BookCondition;
  weight_kg: number;
  seller_price: number;
  display_price: number;
  description: string | null;
  photos: string[];
  status: ListingStatus;
  created_at: string;
  expires_at: string;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_charge: number;
  total_amount: number;
  status: OrderStatus;
  pickup_scheduled_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
