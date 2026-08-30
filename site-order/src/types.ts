export type Language = 'fr' | 'en' | 'ar';

export type CategoryId =
  | 'popular'
  | 'veg_starters'
  | 'nonveg_starters'
  | 'veg_mains'
  | 'main_courses'
  | 'tandoori'
  | 'biryani'
  | 'naan_rice'
  | 'desserts'
  | 'cold_drinks'
  | 'hot_drinks';

export interface Category {
  id: CategoryId;
  nameFr: string;
  nameEn: string;
  nameAr?: string;
  emoji: string;
}

export interface MenuItem {
  id: string;
  categoryId: CategoryId;
  nameFr: string;
  nameEn: string;
  nameAr?: string;
  descFr: string;
  descEn: string;
  descAr?: string;
  price: number; // in DH
  image: string;
  isVegan?: boolean;
  isSpicy?: boolean;
  isExtraSpicy?: boolean;
  isVeg?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedRice?: MenuItem;
}

export type OrderType = 'delivery' | 'takeaway' | 'dinein';

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  addressOrTable: string;
  specialNotes: string;
}
