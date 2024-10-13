import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './interface/product.interface';

@Injectable()
export class ProductService implements OnModuleInit {
  private readonly logger = new Logger(ProductService.name);

  //In memory data storage
  private products: Product[] = [];

  constructor() { }

  async onModuleInit() {
    this.logger.log('Initializing module and fetching product data from external API...');
    await this.fetchProductData();
  }

  async fetchProductData() {
    try {
      const response = await axios.get('http://data-service:4001/productdata');

      this.products = response.data.map((product: Partial<Product>) => ({
        id: uuidv4(),
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        stock: 0,
      }));

      this.logger.log('Product data successfully fetched and stored in memory.');
    } catch (error) {
      this.logger.error('Failed to fetch product data from the API.', error);
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }

  async getProductsByCategory(category: string, inStock?: boolean): Promise<Product[]> {
    return this.products.filter(product =>
      product.category === category && (inStock ? product.stock > 0 : true)
    );
  }

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | undefined> {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      this.logger.error(`Product with ID ${id} not found.`);
      return undefined;
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updateData };

    this.logger.log(`Product with ID ${id} updated.`);
    return this.products[productIndex];
  }

  async updateStock(id: string, stock: number): Promise<Product | undefined> {
    const product = await this.getProductById(id);
    if (!product) {
      this.logger.error(`Product with ID ${id} not found.`);
      return undefined;
    }

    product.stock = stock;
    this.logger.log(`Stock for product with ID ${id} updated to ${stock}.`);
    return product;
  }

  async getAllProductsPaginated(page: number, limit: number): Promise<{ data: Product[], total: number }> {
    try {
      const start = (page - 1) * limit;
      const end = page * limit;
      const paginatedProducts = this.products.slice(start, end);

      return {
        data: paginatedProducts,
        total: this.products.length,
      };
    } catch (error) {
      this.logger.error('Error occurred while paginating products.', error);
      throw new Error('Failed to retrieve paginated products');
    }
  }

}
