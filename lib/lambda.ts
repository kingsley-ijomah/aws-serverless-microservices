import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

// lambda interface
export interface LambdaProps {
  productTable: ITable;
  basketTable: ITable;
  orderTable: ITable;
}

// create a construct for the lambda
export class Lambda extends Construct {
  public readonly productFunction: NodejsFunction;
  public readonly basketFunction: NodejsFunction;
  public readonly orderFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    // create product nodejsfunction
    this.productFunction = this.createProductFunction(props.productTable);
    this.basketFunction = this.createBasketFunction(props.basketTable);
    this.orderFunction = this.createOrderFunction(props.orderTable);
  }

  // create product nodejsfunction
  private createProductFunction(productTable: ITable): NodejsFunction {
    const productFunction = new NodejsFunction(this, 'productFunction', {
      entry: 'src/product/index.js',
      handler: 'handler',
      environment: {
        DATABASE_TABLE_NAME: productTable.tableName,
        PRIMARY_KEY: 'id',
      },
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
      description: 'Product Lambda'
    });
    // grant readwrite permission
    productTable.grantReadWriteData(productFunction);

    return productFunction;
  }

  // create basket nodejsfunction
  private createBasketFunction(basketTable: ITable): NodejsFunction {
    const basketFunction = new NodejsFunction(this, 'basketFunction', {
      entry: 'src/basket/index.js',
      handler: 'handler',
      environment: {
        DATABASE_TABLE_NAME: basketTable.tableName,
        PRIMARY_KEY: 'userName',
        EVENT_SOURCE: 'com.chn.basket.checkoutbasket', // must match event bus source
        EVENT_DETAIL_TYPE: 'CheckoutBasket', // must match event bus detailType
        EVENT_BUS_NAME: 'ChnEventBus', // must match event bus name
      },
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
      description: 'Basket Lambda'
    });
    // grant readwrite permission
    basketTable.grantReadWriteData(basketFunction);

    return basketFunction;
  }

  // create order nodejsfunction
  private createOrderFunction(orderTable: ITable): NodejsFunction {
    const orderFunction = new NodejsFunction(this, 'orderFunction', {
      entry: 'src/ordering/index.js',
      handler: 'handler',
      environment: {
        DATABASE_TABLE_NAME: orderTable.tableName,
        PRIMARY_KEY: 'userName',
      },
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
      description: 'Order Lambda'
    });
    // grant readwrite permission
    orderTable.grantReadWriteData(orderFunction);

    return orderFunction;
  }
}
