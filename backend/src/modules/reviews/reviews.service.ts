import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CanReviewResult } from './interfaces/can-review-result.interface';
import { RatingBreakdown } from './interfaces/rating-breakdown.interface';
import { RatingDistribution } from './interfaces/rating-distribution.interface';
import { ReviewSummary } from './interfaces/review-summary.interface';
import { ReviewableTransaction } from './interfaces/reviewable-transaction.interface';
import { TopRatedUser } from './interfaces/top-rated-user.interface';
import { UserStats } from './interfaces/user-stats.interface';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private transactionsService: TransactionsService,
    private usersService: UsersService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    // Get transaction
    const transaction = await this.transactionsService.findOne(
      createReviewDto.transactionId,
    );

    // Check if transaction is completed
    if (transaction.status !== TransactionStatus.COMPLETED) {
      throw new BadRequestException('Cannot review incomplete transaction');
    }

    // Determine reviewer and reviewee
    let reviewType: 'buyer_to_seller' | 'seller_to_buyer';
    let revieweeId: string;

    if (transaction.buyer.userId.toString() === userId) {
      reviewType = 'buyer_to_seller';
      revieweeId = transaction.seller.userId.toString();
    } else if (transaction.seller.userId.toString() === userId) {
      reviewType = 'seller_to_buyer';
      revieweeId = transaction.buyer.userId.toString();
    } else {
      throw new ForbiddenException('You are not part of this transaction');
    }

    // Check if already reviewed
    const existingReview = await this.reviewModel.findOne({
      transactionId: createReviewDto.transactionId,
      'reviewer.userId': userId,
    });

    if (existingReview) {
      throw new BadRequestException(
        'You have already reviewed this transaction',
      );
    }

    // Get user details
    const reviewer = await this.usersService.findOne(userId);
    const reviewee = await this.usersService.findOne(revieweeId);

    // Create review
    const review = new this.reviewModel({
      transactionId: transaction._id,
      transactionNumber: transaction.transactionNumber,
      reviewer: {
        userId: reviewer._id,
        displayName: reviewer.profile.displayName,
        pictureUrl: reviewer.profile.pictureUrl,
      },
      reviewee: {
        userId: reviewee._id,
        displayName: reviewee.profile.displayName,
        pictureUrl: reviewee.profile.pictureUrl,
      },
      type: reviewType,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      images: createReviewDto.images || [],
      createdFrom: 'web',
    });

    const saved = await review.save();

    // Update user rating
    await this.updateUserRating(revieweeId, reviewType);

    return saved;
  }

  async findAll(filters?: any): Promise<Review[]> {
    const query = { isHidden: false, ...filters };

    return this.reviewModel
      .find(query)
      .populate('reviewer.userId reviewee.userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByTransaction(transactionId: string): Promise<Review[]> {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new BadRequestException('Invalid transaction ID');
    }

    return this.reviewModel
      .find({
        transactionId,
        isHidden: false,
      })
      .populate('reviewer.userId reviewee.userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(
    userId: string,
    type?: 'received' | 'given',
  ): Promise<Review[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const filter: any = { isHidden: false };

    if (type === 'received') {
      filter['reviewee.userId'] = userId;
    } else if (type === 'given') {
      filter['reviewer.userId'] = userId;
    } else {
      filter.$or = [
        { 'reviewer.userId': userId },
        { 'reviewee.userId': userId },
      ];
    }

    return this.reviewModel
      .find(filter)
      .populate('reviewer.userId reviewee.userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid review ID');
    }

    const review = await this.reviewModel
      .findById(id)
      .populate('reviewer.userId reviewee.userId')
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async addResponse(
    reviewId: string,
    userId: string,
    comment: string,
  ): Promise<Review> {
    const review = await this.findOne(reviewId);

    // Check if user is the reviewee
    if (review.reviewee.userId.toString() !== userId) {
      throw new ForbiddenException('Only reviewee can respond to review');
    }

    // Check if already responded
    if (review.response) {
      throw new BadRequestException('Review already has a response');
    }

    review.response = {
      comment,
      respondedAt: new Date(),
    };

    return review.save();
  }

  async updateResponse(
    reviewId: string,
    userId: string,
    comment: string,
  ): Promise<Review> {
    const review = await this.findOne(reviewId);

    // Check if user is the reviewee
    if (review.reviewee.userId.toString() !== userId) {
      throw new ForbiddenException('Only reviewee can update response');
    }

    // Check if response exists
    if (!review.response) {
      throw new BadRequestException('No response exists to update');
    }

    review.response.comment = comment;

    return review.save();
  }

  async deleteResponse(reviewId: string, userId: string): Promise<Review> {
    const review = await this.findOne(reviewId);

    // Check if user is the reviewee
    if (review.reviewee.userId.toString() !== userId) {
      throw new ForbiddenException('Only reviewee can delete response');
    }

    review.response = undefined;

    return review.save();
  }

  async hideReview(
    reviewId: string,
    adminId: string,
    reason: string,
  ): Promise<Review> {
    const review = await this.findOne(reviewId);

    review.isHidden = true;
    review.hiddenReason = reason;
    review.hiddenBy = new Types.ObjectId(adminId);

    return review.save();
  }

  async unhideReview(reviewId: string): Promise<Review> {
    const review = await this.findOne(reviewId);

    review.isHidden = false;
    review.hiddenReason = undefined;
    review.hiddenBy = undefined;

    return review.save();
  }

  async getUserStats(userId: string): Promise<UserStats> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const [receivedReviews, givenReviews] = await Promise.all([
      this.reviewModel.find({ 'reviewee.userId': userId, isHidden: false }),
      this.reviewModel.find({ 'reviewer.userId': userId }),
    ]);

    // Calculate average ratings
    const calculateAverage = (reviews: Review[]): RatingBreakdown => {
      if (reviews.length === 0) return { average: 0, total: 0, count: 0 };

      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = total / reviews.length;

      return {
        average: Math.round(average * 10) / 10,
        total,
        count: reviews.length,
      };
    };

    // Rating distribution
    const ratingDistribution: RatingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    receivedReviews.forEach((review) => {
      ratingDistribution[review.rating as keyof RatingDistribution]++;
    });

    return {
      received: calculateAverage(receivedReviews),
      given: givenReviews.length,
      distribution: ratingDistribution,
      recentReviews: receivedReviews.slice(0, 5),
    };
  }

  async getReviewSummary(userId: string): Promise<ReviewSummary> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const [receivedReviews, givenReviews] = await Promise.all([
      this.reviewModel.find({ 'reviewee.userId': userId, isHidden: false }),
      this.reviewModel.find({ 'reviewer.userId': userId }),
    ]);

    const averageRating =
      receivedReviews.length > 0
        ? receivedReviews.reduce((sum, r) => sum + r.rating, 0) /
          receivedReviews.length
        : 0;

    const lastReviewDate =
      receivedReviews.length > 0 ? receivedReviews[0].createdAt : undefined;

    return {
      totalReceived: receivedReviews.length,
      totalGiven: givenReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      lastReviewDate,
    };
  }

  async canUserReview(
    transactionId: string,
    userId: string,
  ): Promise<CanReviewResult> {
    const transaction = await this.transactionsService.findOne(transactionId);

    // Check if transaction is completed
    if (transaction.status !== TransactionStatus.COMPLETED) {
      return {
        canReview: false,
        reason: 'Transaction must be completed before reviewing',
      };
    }

    // Check if user is part of transaction
    const isBuyer = transaction.buyer.userId.toString() === userId;
    const isSeller = transaction.seller.userId.toString() === userId;

    if (!isBuyer && !isSeller) {
      return {
        canReview: false,
        reason: 'You are not part of this transaction',
      };
    }

    // Check if already reviewed
    const existingReview = await this.reviewModel.findOne({
      transactionId,
      'reviewer.userId': userId,
    });

    if (existingReview) {
      return {
        canReview: false,
        reason: 'You have already reviewed this transaction',
      };
    }

    return { canReview: true };
  }

  async getReviewableTransactions(
    userId: string,
  ): Promise<ReviewableTransaction[]> {
    // Get all completed transactions
    const [buyerTransactions, sellerTransactions] = await Promise.all([
      this.transactionsService.findByUser(userId, 'buyer'),
      this.transactionsService.findByUser(userId, 'seller'),
    ]);

    const completedTransactions = [
      ...buyerTransactions,
      ...sellerTransactions,
    ].filter((tx) => tx.status === TransactionStatus.COMPLETED);

    // Check which ones haven't been reviewed yet
    const reviewable: ReviewableTransaction[] = [];

    for (const transaction of completedTransactions) {
      const existingReview = await this.reviewModel.findOne({
        transactionId: transaction._id,
        'reviewer.userId': userId,
      });

      if (!existingReview) {
        reviewable.push({
          transactionId: transaction._id,
          transactionNumber: transaction.transactionNumber,
          productName: transaction.product.name,
          otherParty:
            transaction.buyer.userId.toString() === userId
              ? transaction.seller.displayName
              : transaction.buyer.displayName,
          completedAt: transaction.completedAt!,
        });
      }
    }

    return reviewable.sort(
      (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
    );
  }

  async getTopRatedUsers(limit = 10): Promise<TopRatedUser[]> {
    const allReviews = await this.reviewModel.find({ isHidden: false }).exec();

    // Group by reviewee
    const userRatings = new Map<
      string,
      { total: number; count: number; user: any }
    >();

    for (const review of allReviews) {
      const userId = review.reviewee.userId.toString();

      if (!userRatings.has(userId)) {
        userRatings.set(userId, {
          total: 0,
          count: 0,
          user: review.reviewee,
        });
      }

      const stats = userRatings.get(userId)!;
      stats.total += review.rating;
      stats.count += 1;
    }

    // Calculate averages and sort
    const topUsers: TopRatedUser[] = Array.from(userRatings.entries())
      .map(([userId, stats]) => ({
        userId,
        displayName: stats.user.displayName,
        pictureUrl: stats.user.pictureUrl,
        averageRating: Math.round((stats.total / stats.count) * 10) / 10,
        reviewCount: stats.count,
      }))
      .filter((user) => user.reviewCount >= 3) // At least 3 reviews
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);

    return topUsers;
  }

  async getReviewsByRating(rating: number, limit = 20): Promise<Review[]> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    return this.reviewModel
      .find({
        rating,
        isHidden: false,
      })
      .populate('reviewer.userId reviewee.userId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async delete(reviewId: string, userId: string): Promise<void> {
    const review = await this.findOne(reviewId);

    // Only reviewer can delete their review (within certain time period)
    if (review.reviewer.userId.toString() !== userId) {
      throw new ForbiddenException('Only reviewer can delete their review');
    }

    // Check if review is recent (e.g., within 24 hours)
    const hoursSinceCreation =
      (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      throw new BadRequestException(
        'Reviews can only be deleted within 24 hours of creation',
      );
    }

    await this.reviewModel.findByIdAndDelete(reviewId);

    // Update user rating after deletion
    const reviewType = review.type;
    const revieweeId = review.reviewee.userId.toString();
    await this.updateUserRating(revieweeId, reviewType);
  }

  private async updateUserRating(
    userId: string,
    reviewType: string,
  ): Promise<void> {
    const reviews = await this.reviewModel.find({
      'reviewee.userId': userId,
      isHidden: false,
    });

    if (reviews.length === 0) {
      // Reset to zero if no reviews
      await this.usersService.update(userId, {
        [`rating.${reviewType === 'buyer_to_seller' ? 'asSeller' : 'asBuyer'}`]:
          {
            average: 0,
            total: 0,
            count: 0,
          },
      } as any);
      return;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    const count = reviews.length;

    // Determine which rating to update
    const ratingField =
      reviewType === 'buyer_to_seller' ? 'asSeller' : 'asBuyer';

    await this.usersService.update(userId, {
      [`rating.${ratingField}`]: {
        average: Math.round(average * 10) / 10,
        total,
        count,
      },
    } as any);
  }
}
