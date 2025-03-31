import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../../schemas/order.schema';
import { Cart } from '../../schemas/cart.schema';
import { Model } from 'mongoose';
import { Wishlist } from '../../schemas/wishlist.schema';
import { Item } from '../../schemas/item.schema';
import { Unit } from '../../schemas/unit.schema';
import { ItemDynamicData } from '../../schemas/dynamicItemsData.schema';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(ItemDynamicData.name) private itemDynamicDataModel: Model<ItemDynamicData>,
    @InjectModel(Unit.name) private unitModel: Model<Unit>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private ordersGateway: OrdersGateway,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items } = createOrderDto;
    
    // Calculate total amount for the order
    let totalAmount = 0;
  
    // Initialize an array to store updated items (with their totalPrice)
    const updatedItems = [];
  
    // Update stock and verify for each item
    for (const item of items) {
      const dynamicData = await this.itemDynamicDataModel.findOne({ itemId: item.itemId, unitId: item.unitId });
      
      if (!dynamicData || parseFloat(dynamicData.stock.toString()) < item.quantity) {
        throw new NotFoundException(`Insufficient stock for item ${item.itemId}`);
      }
  
      // Calculate the total price for this item (price is stored as a string)
      const itemPrice = dynamicData.price; // Convert the price string to a number
      const totalItemPrice = itemPrice * item.quantity;
      totalAmount += totalItemPrice; // Add item total to order total
  
      // Reduce stock for the item

      updatedItems.push({
        ...item,
        totalPrice: totalItemPrice,
      });

      
      await this.itemDynamicDataModel.updateOne(
        { itemId: item.itemId, unitId: item.unitId },
        { $inc: { stock: -item.quantity } },
        );
      }

      const discount = createOrderDto.discount || 0;
      const taxAmount = createOrderDto.taxAmount || 0;
      const grandTotal = totalAmount - discount + taxAmount;
  
  
    // Create the order with the total amount calculated
    const order = new this.orderModel({
      ...createOrderDto,
      status: 'Pending',
      deliveryAgentId: null,
      totalAmount,
      discount,
      taxAmount,
      grandTotal,
      items: updatedItems,
    });
    const savedOrder = await order.save();

    this.ordersGateway.notifyDeliveryAgents(savedOrder);
    return savedOrder;
  }
  

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).populate('items.itemId').exec();
  }

  // Update an order
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true }).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    this.ordersGateway.sendOrderUpdate(order);
    return order;
  }

  async deleteOrder(orderId: string): Promise<void> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Restore stock for items
    for (const item of order.items) {
      await this.itemDynamicDataModel.updateOne(
        { itemId: item.itemId, unitId: item.unitId },
        { $inc: { stock: item.quantity } },
      );
    }

    await this.orderModel.deleteOne({ _id: orderId });
  }

  // Get order by ID
  
}
