import { IsArray, IsNotEmpty, IsString, IsNumber, IsMongoId, IsOptional, isNumber } from 'class-validator';


export class ItemDto {
  @IsMongoId()
  itemId: string;  // Item identifier
  
  @IsNumber()
  quantity: number;  // Quantity of the item
  
  @IsMongoId()
  unitId: string;  // Unit of the item
  
  @IsNumber()
  price: number;  // Price of the item, stored as a string
}
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;  // User who placed the order

  @IsArray()
  @IsNotEmpty()
  items: ItemDto[];  // Array of items in the order

  @IsNumber()
  totalAmount: number;  // Total amount of the order

  @IsNotEmpty()
  @IsString()
  status: string;  // Status of the order (e.g., 'Pending', 'Confirmed', 'Shipped', 'Delivered')

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;  // Shipping address for the order

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;  // Payment method (e.g., 'Credit Card', 'PayPal', etc.)
}


  export class OrderResponseDto {
    @IsString()
    orderId: string;
  
    @IsString()
    userId: string;
  
    @IsArray()
    items: ItemDto[];  // Array of items in the order, populated with details
  
    @IsNumber()
    totalAmount: number;  // Total amount of the order
  
    @IsString()
    status: string;  // Status of the order
  
    @IsString()
    shippingAddress: string;  // Shipping address for the order
  
    @IsString()
    paymentMethod: string;  // Payment method used for the order
  }