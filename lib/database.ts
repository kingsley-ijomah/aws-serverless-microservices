import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import { ITable } from "aws-cdk-lib/aws-dynamodb";

export class Database extends Construct {
  public readonly productTable: ITable;
  public readonly basketTable: ITable;
  public readonly orderTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.productTable = this.createProductTable();
    this.basketTable = this.createBasketTable();
    this.orderTable = this.createOrderTable();
  }

  // create product table
  // {
  //   "name": "iphoneX",
  //   "description": "this is the first product release",
  //   "imageFile": "product-1.png",
  //   "category": "Phone",
  //   "price": 950.4
  // }
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
  // {
  //   "userName": "k.i",
  //   "items": [
  //       {
  //           "quality": 2,
  //           "color": "Red",
  //           "price": 950,
  //           "productId": "ABC-123",
  //           "productName": "iPhoneX"
  //       },
  //       {
  //           "quality": 1,
  //           "color": "Green",
  //           "price": 650,
  //           "productId": "ABC-124",
  //           "productName": "iPhoneY"
  //       }
  //   ]
  // }
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

  // create order table
  // {
  //   "userName": "k.i",
  //   "totalPrice": 0,
  //   "firstName": "Kingsley",
  //   "lastName": "Ijomah",
  //   "email": "king@test.com",
  //   "address": "Puerto Rico",
  //   "cardInfo": "5554442211",
  //   "paymentMethod": 1
  //   "orderDate": 
  // }
  private createOrderTable(): ITable {
    const orderTable = new dynamodb.Table(this, 'order', {
      partitionKey: {
        name: 'userName',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'orderDate',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'order',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    return orderTable;
  }
}