import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum TransactionStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success', 
  FAILED = 'Failed'
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  collect_id: string;

  @Prop({ required: true })
  school_id: string;

  @Prop()
  gateway: string;

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop({ 
    type: String, 
    enum: TransactionStatus, 
    default: TransactionStatus.PENDING 
  })
  status: TransactionStatus;

  @Prop()
  custom_order_id: string;

  @Prop()
  bank_reference?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

export class CreateTransactionDto {
  @IsString()
  collect_id: string;

  @IsString()
  school_id: string;

  @IsString()
  @IsOptional()
  gateway?: string;

  @IsNumber()
  order_amount: number;

  @IsNumber()
  transaction_amount: number;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsString()
  @IsOptional()
  custom_order_id?: string;
}

export class UpdateTransactionStatusDto {
  @IsString()
  custom_order_id: string;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}

export class WebhookPayloadDto {
  status: number;
  order_info: {
    order_id: string;
    order_amount: number;
    transaction_amount: number;
    gateway: string;
    bank_reference: string;
  };
}