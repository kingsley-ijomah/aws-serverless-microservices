// create apigateway construct class
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

// apigateway interface
export interface ApiGatewayProps {
  productFunction: NodejsFunction;
}

export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    // create LamdaRestApi with productFunction
    const apgw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: props.productFunction,
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
}

