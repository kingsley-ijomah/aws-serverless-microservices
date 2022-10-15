import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { IQueue } from "aws-cdk-lib/aws-sqs";

interface ChnEventBusProps {
  publisherFunction: IFunction;
  targetQueue: IQueue;
}

// create a construct for the event bus
export class ChnEventBus extends Construct {

  constructor(scope: Construct, id: string, props: ChnEventBusProps) {
    super(scope, id);
    
    // event bus
    const eventBus = new EventBus(this, 'EventBus', {
      eventBusName: 'ChnEventBus',
    });

    // event bus checkoutBasket rule
    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus: eventBus,
      eventPattern: {
        source: ['com.chn.basket.checkoutbasket'], // can be any string
        detailType: ['CheckoutBasket'], // can be any string
      },
      ruleName: 'CheckoutBasketRule', // can be any string
    });

    // add target to checkoutBasket rule
    checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue));

    // grant permission to publish to event bus
    eventBus.grantPutEventsTo(props.publisherFunction);
  }
}