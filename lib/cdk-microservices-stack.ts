import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CdkMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create product table
    const productTable = new dynamodb.Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'product',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
}
