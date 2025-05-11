import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

class ProductService {
  private productModel = ProductModel;

  async createProduct(data: Partial<IProduct>) {
    const product = new this.productModel(data);
    return await product.save();
  }

  async getAllProducts() {
    return await this.productModel.find();
  }

  async getProductById(id: string) {
    return await this.productModel.findById(id);
  }
}

export default ProductService;