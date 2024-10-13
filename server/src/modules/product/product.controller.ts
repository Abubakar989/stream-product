import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product-dto';

@ApiTags('products')
@Controller({ path: 'products', version: ['1'] })
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', type: Number, description: 'Number of items per page', required: false })
  @Get()
  async getProductsPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.productService.getAllProductsPaginated(page, limit);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({
    name: 'category',
    description: 'The category of the products',
    type: String,
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    type: Boolean,
    description: 'Whether the product is in stock',
  })
  @Get('category/:category')
  async getProductsByCategory(
    @Param('category') category: string,
    @Query('inStock') inStock?: boolean,
  ) {
    return await this.productService.getProductsByCategory(category, inStock);
  }

  @ApiOperation({ summary: 'Update product details' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String })
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDto) {
    return await this.productService.updateProduct(id, updateData);
  }

  @ApiOperation({ summary: 'Update stock level of a product' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stock: {
          type: 'number',
          example: 10,
          description: 'The new stock level of the product',
        },
      },
    },
  })
  @Patch(':id/stock')
  async updateStock(@Param('id') id: string, @Body('stock') stock: number) {
    return await this.productService.updateStock(id, stock);
  }
}
