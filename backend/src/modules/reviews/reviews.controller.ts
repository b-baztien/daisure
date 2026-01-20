import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query('transactionId') transactionId?: string,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    if (transactionId) {
      return this.reviewsService.findByTransaction(transactionId, paginationQuery);
    }
    return this.reviewsService.findAll(undefined, paginationQuery);
  }

  @Get('my-reviews')
  getMyReviews(
    @Request() req,
    @Query('type') type?: 'received' | 'given',
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    return this.reviewsService.findByUser(req.user.userId, type, paginationQuery);
  }

  @Get('user/:userId')
  getUserReviews(
    @Param('userId') userId: string,
    @Query('type') type?: 'received' | 'given',
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    return this.reviewsService.findByUser(userId, type, paginationQuery);
  }

  @Get('user/:userId/stats')
  getUserStats(@Param('userId') userId: string) {
    return this.reviewsService.getUserStats(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post(':id/response')
  addResponse(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { comment: string },
  ) {
    return this.reviewsService.addResponse(id, req.user.userId, body.comment);
  }

  @Patch(':id/hide')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  hideReview(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { reason: string },
  ) {
    return this.reviewsService.hideReview(id, req.user.userId, body.reason);
  }

  @Patch(':id/unhide')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  unhideReview(@Param('id') id: string) {
    return this.reviewsService.unhideReview(id);
  }
}
