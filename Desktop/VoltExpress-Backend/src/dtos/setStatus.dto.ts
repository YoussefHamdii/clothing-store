import { IsString, IsMongoId, IsOptional } from 'class-validator';

class SetStatusDto {
  @IsMongoId()
  public orderId: string;

  @IsString()
  public newStatus: string;
  @IsOptional()
  @IsString()
  public feedback: string;
}

export default SetStatusDto;
