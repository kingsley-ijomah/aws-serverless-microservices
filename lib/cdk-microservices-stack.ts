import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { ProdDatabase } from './database';

export class CdkMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create database
    const database = new ProdDatabase(this, 'Database');

    // create product nodejsfunction
    const productFunction = new NodejsFunction(this, 'productFunction', {
      entry: 'src/product/index.js',
      handler: 'handler',
      environment: {
        PRODUCT_TABLE: database.productTable.tableName,
        PRIMARY_KEY: 'id',
      },
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
    });

    // grant readwrite permission
    database.productTable.grantReadWriteData(productFunction);

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
}
