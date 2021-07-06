import { IsString } from 'class-validator'; 

class RecieverDetailsDto{

    @IsString()
    name: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    address: string

    @IsString()
    city: string;

    @IsString()
    area: string;
}

export default RecieverDetailsDto;