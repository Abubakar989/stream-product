import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @ApiProperty({ description: 'The price of the product' })
  price: number;

  @ApiProperty({
    description: 'The description of the product',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'The category of the product' })
  category: string;
}
