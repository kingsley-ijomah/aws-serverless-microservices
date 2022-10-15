import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export interface ChnQueueProps {
  consumer: IFunction;
}

// create a construct for the SQS queue
export class ChnQueue extends Construct {

  public readonly orderQueue: IQueue;

  constructor(scope: Construct, id: string, props: ChnQueueProps) {
    super(scope, id);
    
    // create SQS queue
    this.orderQueue = new Queue(this, 'OrderQueue', {
      queueName: 'OrderQueue',
      visibilityTimeout: Duration.seconds(30),
    });
    
    // add SQS event source to consumer function
    props.consumer.addEventSource(new SqsEventSource(this.orderQueue, {
      batchSize: 1,
    }));
  }
}