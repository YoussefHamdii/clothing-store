import OrderDto from './createOrder.dto';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class bulkOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderDto)
  public orders: OrderDto[];
}

export default bulkOrderDto;
