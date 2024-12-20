import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSchema } from './dto/transaction.dto';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema }
    ]),
    AuthModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}

// transactions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  Transaction, 
  CreateTransactionDto, 
  UpdateTransactionStatusDto, 
  WebhookPayloadDto,
  TransactionStatus 
} from './dto/transaction.dto';
import * as Papa from 'papaparse';
import * as fs from 'fs';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) 
    private transactionModel: Model<Transaction>
  ) {}

  async importCSVData(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(fileContent, { 
      header: true, 
      skipEmptyLines: true 
    });

    const transactions = parsedData.data.map(row => ({
      collect_id: row.collect_id,
      school_id: row.school_id,
      gateway: row.gateway,
      order_amount: parseFloat(row.order_amount),
      transaction_amount: parseFloat(row.transaction_amount),
      status: row.status || TransactionStatus.PENDING,
      custom_order_id: row.custom_order_id
    }));

    return this.transactionModel.insertMany(transactions);
  }

  async findAll(
    page = 1, 
    limit = 10, 
    status?: TransactionStatus, 
    startDate?: Date, 
    endDate?: Date
  ) {
    const query: any = {};
    
    if (status) query.status = status;
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const transactions = await this.transactionModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.transactionModel.countDocuments(query);

    return {
      transactions,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findBySchool(schoolId: string) {
    return this.transactionModel.find({ school_id: schoolId }).exec();
  }

  async checkTransactionStatus(customOrderId: string) {
    const transaction = await this.transactionModel
      .findOne({ custom_order_id: customOrderId })
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateTransactionStatus(
    customOrderId: string, 
    status: TransactionStatus
  ) {
    const transaction = await this.transactionModel
      .findOneAndUpdate(
        { custom_order_id: customOrderId },
        { status },
        { new: true }
      )
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async handleWebhook(payload: WebhookPayloadDto) {
    const { order_info } = payload;
    
    if (!order_info.order_id) {
      throw new BadRequestException('Invalid order_id');
    }

    // Determine status based on payload
    const status = payload.status === 200 
      ? TransactionStatus.SUCCESS 
      : TransactionStatus.FAILED;

    return this.updateTransactionStatus(
      order_info.order_id, 
      status
    );
  }
}

// transactions.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { 
  UpdateTransactionStatusDto, 
  WebhookPayloadDto,
  TransactionStatus
} from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService
  ) {}

  @Get()
  async getAllTransactions(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: TransactionStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date
  ) {
    return this.transactionsService.findAll(
      page, 
      limit, 
      status, 
      startDate, 
      endDate
    );
  }

  @Get('school/:schoolId')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string
  ) {
    return this.transactionsService.findBySchool(schoolId);
  }

  @Get('status/:customOrderId')
  async checkTransactionStatus(
    @Param('customOrderId') customOrderId: string
  ) {
    return this.transactionsService.checkTransactionStatus(customOrderId);
  }

  @Post('status')
  async manualStatusUpdate(
    @Body() updateDto: UpdateTransactionStatusDto
  ) {
    return this.transactionsService.updateTransactionStatus(
      updateDto.custom_order_id, 
      updateDto.status
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Body() payload: WebhookPayloadDto
  ) {
    return this.transactionsService.handleWebhook(payload);
  }
}