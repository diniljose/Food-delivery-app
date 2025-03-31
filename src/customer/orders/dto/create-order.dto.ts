import { 
  IsArray, 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsMongoId, 
  IsOptional 
} from 'class-validator';

// Item DTO with totalPrice included
export class ItemDto {

  @IsString()
  itemId: string;  // Item identifier
  
  @IsNumber()
  quantity: number;  // Quantity of the item
  
  @IsMongoId()
  unitId: string;  // Unit of the item
  
  @IsNumber()
  price: number;  // Price of the item
  
  @IsNumber()
  totalPrice: number;  // Total price for this item (price * quantity)
}

// DTO for creating an order
export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;  // User who placed the order

  @IsArray()
  @IsNotEmpty()
  items: ItemDto[];  // Array of items in the order

  @IsNumber()
  totalAmount: number;  // Total amount of the order before tax & discounts

  @IsNumber()
  discount: number;  // Discount applied to the order

  @IsNumber()
  taxAmount: number;  // Tax calculated based on items

  @IsNumber()
  grandTotal: number;  // Grand total after applying discount and tax

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;  // Shipping address for the order

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;  // Payment method used (e.g., 'Credit Card', 'PayPal')

  @IsOptional()
  @IsString()
  customerNote?: string;  // Optional field for delivery instructions

  @IsOptional()
  estimatedDeliveryTime?: Date;  // Optional field for estimated delivery

  @IsOptional()
  @IsMongoId()
  deliveryAgentId?: string;  // Initially null until assigned

  @IsNotEmpty()
  @IsString()
  status: string;  // Order status (e.g., 'Pending', 'Accepted', etc.)
}

// DTO for returning an order response
export class OrderResponseDto {
  @IsMongoId()
  orderId: string;

  @IsMongoId()
  userId: string;

  @IsArray()
  items: ItemDto[];  // Array of items in the order

  @IsNumber()
  totalAmount: number;  // Total amount before tax & discounts

  @IsNumber()
  discount: number;  // Discount applied to the order

  @IsNumber()
  taxAmount: number;  // Tax calculated based on items

  @IsNumber()
  grandTotal: number;  // Grand total after applying discount and tax

  @IsString()
  shippingAddress: string;  // Shipping address for the order

  @IsString()
  paymentMethod: string;  // Payment method used for the order

  @IsOptional()
  @IsString()
  customerNote?: string;  // Optional field for delivery instructions

  @IsOptional()
  estimatedDeliveryTime?: Date;  // Optional field for estimated delivery

  @IsOptional()
  @IsMongoId()
  deliveryAgentId?: string;  // Delivery agent assigned

  @IsString()
  status: string;  // Order status
}
