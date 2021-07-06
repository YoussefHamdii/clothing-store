import { IsMongoId } from 'class-validator';

class PickupDto {
  @IsMongoId()
  public pickupId: string;
}

export default PickupDto;
