import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

export class ProdDatabase extends Construct {
  public readonly productTable: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

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

    this.productTable = productTable;
  }
}