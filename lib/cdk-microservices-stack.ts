import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Lambda } from './lambda';
import { Database } from './database';
import { ApiGateway } from './api-gateway';
import { ChnEventBus } from './eventbus';


export class CdkMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create database
    const database = new Database(this, 'Database');

    // create lambda
    const lambda = new Lambda(this, 'Microservice', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable,
    });

    // create api gateway
    const apigateway = new ApiGateway(this, 'ApiGateway', {
      productFunction: lambda.productFunction,
      basketFunction: lambda.basketFunction,
      orderFunction: lambda.orderFunction,
    });

    // create event bus
    const eventBus = new ChnEventBus(this, 'EventBus', {
      publisherFunction: lambda.basketFunction,
      targetFunction: lambda.orderFunction,
    });

  }
}
