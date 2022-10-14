import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Microservice } from './microservice';
import { ProdDatabase } from './database';
import { ApiGateway } from './api-gateway';

export class CdkMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create database
    const database = new ProdDatabase(this, 'Database');

    // create microservice
    const microservice = new Microservice(this, 'Microservice', {
      productTable: database.productTable,
    });

    // create api gateway
    const apigateway = new ApiGateway(this, 'ApiGateway', {
      productFunction: microservice.productFunction,
    });
  }
}
