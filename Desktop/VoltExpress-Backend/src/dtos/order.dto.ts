import { IsMongoId } from 'class-validator';

class OrderDto {
  public orderId: string[];
}

export default OrderDto;
