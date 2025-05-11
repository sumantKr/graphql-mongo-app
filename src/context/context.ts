import CustomerService from "../controllers/customer/customer.service";
import OrderService from "../controllers/order/order.service";
import ProductService from "../controllers/product/product.service";

export const dataSourceContext = {
  dataSources: {
    customerService: new CustomerService(),
    productService: new ProductService(),
    orderService: new OrderService(),
  },
};

export type IDataSourceContext = typeof dataSourceContext 