import { prisma } from "../../config/prisma";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";


const createReview = async (
  customerId: string,
  payload: {

    rating: number;
    comment?: string;
    gearItemId: string;
  }
) => {

  const gear = await prisma.gearItem.findUnique({
    where: { id: payload.gearItemId },
  });
  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear item not found");
  }

 
  const returnedOrder = await prisma.rentalOrder.findFirst({

    where: {
      customerId,
      status: "RETURNED",
      items: { some: { gearItemId: payload.gearItemId } },
    },
  });
  
  if (!returnedOrder) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only review gear after completing (returning) a rental for it"
    );
  }


  return prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      customerId,
      gearItemId: payload.gearItemId,
    },

    include: {
      customer: { select: { id: true, name: true } },
      gearItem: { select: { id: true, name: true } },
    },
  });
};



const getReviewsByGear = async (gearItemId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id: gearItemId },
    select: { id: true },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear item not found");

  }
  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { gearItemId },
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { id: true, name: true } } },

    }),
    prisma.review.aggregate({
      where: { gearItemId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  return {
    
    reviews,
    averageRating: aggregate._avg.rating,
    totalReviews: aggregate._count.rating,
  };
};

export const ReviewService = {
  createReview,
  getReviewsByGear,
};
