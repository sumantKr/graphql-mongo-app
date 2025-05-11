import { CustomerModel } from "./customers.model";
import { ICustomer } from "./customer.interface";

class CustomerService {
  private customerModel = CustomerModel;
  async createCustomer(data: Partial<ICustomer>) {
    const customer = new this.customerModel(data);
    return await customer.save();
  }

  async getAllCustomers() {
    return await this.customerModel.find();
  }

  async getCustomerById(id: string) {
    return await this.customerModel.findById(id);
  }
}

export default CustomerService;
