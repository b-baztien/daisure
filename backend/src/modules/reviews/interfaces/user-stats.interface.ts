import { Review } from '../schemas/review.schema';
import { RatingBreakdown } from './rating-breakdown.interface';
import { RatingDistribution } from './rating-distribution.interface';

export interface UserStats {
  received: RatingBreakdown;
  given: number;
  distribution: RatingDistribution;
  recentReviews: Review[];
}
