import {
  IsBoolean,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import 'reflect-metadata';

import RecieverDetailsDto from './recieverDetails.dto';

class CreateOrderDto {
  @IsString()
  public shipmentType: string;

  @IsString()
  public shipperName: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => RecieverDetailsDto)
  public recieverDetails: RecieverDetailsDto;

  @IsOptional()
  @IsBoolean()
  public allowOpen: boolean;

  @IsOptional()
  @IsString()
  public description: string;

  @IsNumber()
  public price: number;
}

export default CreateOrderDto;
