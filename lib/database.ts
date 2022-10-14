import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import { ITable } from "aws-cdk-lib/aws-dynamodb";

export class Database extends Construct {
  public readonly productTable: ITable;
  public readonly basketTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.productTable = this.createProductTable();
    this.basketTable = this.createBasketTable();
  }

  // create product table
  private createProductTable(): ITable {
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

    return productTable;
  }

  // create basket table
  private createBasketTable(): ITable {
    // create basket table
    const basketTable = new dynamodb.Table(this, 'basket', {
      partitionKey: {
        name: 'userName',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'basket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    return basketTable;
  }
}