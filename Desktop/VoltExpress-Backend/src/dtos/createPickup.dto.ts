import {
  IsString,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import RecieverDetailsDto from './recieverDetails.dto';

class CreatePickupDto {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => RecieverDetailsDto)
  public pickupDetails: RecieverDetailsDto;

  @IsString()
  pickupDate: string;

  @IsString()
  pickupTime: string;

  @IsString()
  pickupNotes: string;

  @IsOptional()
  @IsBoolean()
  isPickedup: boolean;
}

export default CreatePickupDto;
