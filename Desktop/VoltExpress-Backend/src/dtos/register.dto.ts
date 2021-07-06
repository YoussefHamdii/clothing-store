import { IsString, IsOptional } from 'class-validator';

class registerDto{

    @IsString()
    public email: string;

    @IsString()
    public password: string;

    @IsString()
    public name: string;

    @IsString()
    public phoneNumber1: string;

    @IsOptional()
    @IsString()
    public phoneNumber2: string;

    @IsString()
    public role: string;
}

export default registerDto;