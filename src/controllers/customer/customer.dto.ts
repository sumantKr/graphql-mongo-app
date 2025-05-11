import { IsString, IsEmail, IsInt, Min, Max, IsIn } from 'class-validator';
import { ICustomer } from './customer.interface';

export class CreateCustomerDto implements ICustomer{
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @IsString()
  location: string;

  @IsIn(['Male', 'Female', 'Other'])
  gender: 'Male' | 'Female' | 'Other';
}
