import { IsNumber, IsString, Min } from 'class-validator';
import { IProduct } from './product.interface';

export class CreatProductDto implements IProduct{
  @IsString() 
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}
