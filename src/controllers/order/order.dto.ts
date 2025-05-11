import {
  IsArray,
  IsString,
  IsNumber,
  Min,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

class OrderProductDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  priceAtPurchase: number;
}

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
