// create apigateway construct class
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

// apigateway interface
export interface ApiGatewayProps {
  productFunction: IFunction;
  basketFunction: IFunction;
  orderFunction: IFunction;
}

export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.createProductApi(props.productFunction);
    this.createBasketApi(props.basketFunction);
    this.createOrderApi(props.orderFunction);
  }

  private createProductApi(productFunction: IFunction) {
    // create LamdaRestApi with productFunction
    const apgw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: productFunction,
      proxy: false
    });

    // create product resource
    const product = apgw.root.addResource('product');
    product.addMethod('GET'); // GET /product
    product.addMethod('POST'); // POST /product

    // create product/{id} resource
    const productWithId = product.addResource('{id}');
    productWithId.addMethod('GET'); // GET /product/{id}
    productWithId.addMethod('PUT'); // PUT /product/{id}
    productWithId.addMethod('DELETE'); // DELETE /product/{id}
  }

  private createBasketApi(basketFunction: IFunction) {
    // create LamdaRestApi with basketFunction
    const apgw = new LambdaRestApi(this, 'basketApi', {
      restApiName: 'Basket Service',
      handler: basketFunction,
      proxy: false
    });

    // create basket resource
    const basket = apgw.root.addResource('basket');
    basket.addMethod('GET'); // GET /basket
    basket.addMethod('POST'); // POST /basket

    // create basket/{userName} resource
    const basketWithUserName = basket.addResource('{userName}');
    basketWithUserName.addMethod('GET'); // GET /basket/{userName}
    basketWithUserName.addMethod('DELETE'); // DELETE /basket/{userName}

    // create basket/checkout resource
    const checkout = basket.addResource('checkout');
    checkout.addMethod('POST'); // POST /basket/checkout
  }

  private createOrderApi(orderFunction: IFunction) {
    // create LamdaRestApi with orderFunction
    const apgw = new LambdaRestApi(this, 'orderApi', {
      restApiName: 'Order Service',
      handler: orderFunction,
      proxy: false
    });

    // create order resource
    const order = apgw.root.addResource('order');
    order.addMethod('GET'); // GET /order

    // create order/{userName} resource
    const orderWithId = order.addResource('{userName}');
    orderWithId.addMethod('GET'); // GET /order/{userName}
  }

}

