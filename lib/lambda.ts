import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

// lambda interface
export interface LambdaProps {
  productTable: ITable;
  basketTable: ITable;
}

// create a construct for the lambda
export class Lambda extends Construct {
  public readonly productFunction: NodejsFunction;
  public readonly basketFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    // create product nodejsfunction
    this.productFunction = this.createProductFunction(props.productTable);
    this.basketFunction = this.createBasketFunction(props.basketTable);
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
      },
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
    });
    // grant readwrite permission
    basketTable.grantReadWriteData(basketFunction);

    return basketFunction;
  }
}
