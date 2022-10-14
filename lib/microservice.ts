import { Construct } from "constructs";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

// microservice interface
export interface MicroserviceProps {
  productTable: ITable
}

// create a construct for the microservice
export class Microservice extends Construct {

  public readonly productFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: MicroserviceProps) {
    super(scope, id);

    // create product nodejsfunction
    const productFunction = new NodejsFunction(this, 'productFunction', {
      entry: 'src/product/index.js',
      handler: 'handler',
      environment: {
        PRODUCT_TABLE: props.productTable.tableName,
        PRIMARY_KEY: 'id',
      },
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_14_X,
    });

    // grant readwrite permission
    props.productTable.grantReadWriteData(productFunction);

    this.productFunction = productFunction;
  }
}