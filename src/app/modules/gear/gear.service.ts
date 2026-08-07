import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";



const createGear = async (
  providerId: string,
  payload: {
    name: string;
    description: string;
    brand?: string;
    pricePerDay: number;
    stock: number;
    availability: "AVAILABLE" | "UNAVAILABLE";
    categoryId: string;
    images?: string[];
  }
) => {
  
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.gearItem.create({
    data: {
      ...payload,
      pricePerDay: new Prisma.Decimal(payload.pricePerDay),
      providerId,
      images: payload.images ?? [],
    },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
  });
};

const updateGear = async (
  providerId: string,
  gearId: string,
  payload: Record<string, any>
) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
  if (!gear) throw new AppError(httpStatus.NOT_FOUND, "Gear item not found");
  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only manage your own gear items"
    );
  }
  const data: any = { ...payload };
  if (payload.pricePerDay !== undefined) {
    data.pricePerDay = new Prisma.Decimal(payload.pricePerDay);
  }
  return prisma.gearItem.update({
    where: { id: gearId },
    data,
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
  });
};

const deleteGear = async (providerId: string, gearId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
  if (!gear) throw new AppError(httpStatus.NOT_FOUND, "Gear item not found");
  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only manage your own gear items"
    );
  }
  return prisma.gearItem.delete({ where: { id: gearId } });
};

const getMyGear = async (providerId: string) => {
  return prisma.gearItem.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { reviews: true } } },
  });
};



const getAllGear = async (query: {
  search?: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: "AVAILABLE" | "UNAVAILABLE";
  sortBy?: "priceAsc" | "priceDesc" | "newest" | "oldest";
  page?: string;
  limit?: string;
}) => {
  const page = Math.max(1, Number(query.page ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? "20")));
  const skip = (page - 1) * limit;

  const where: Prisma.GearItemWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.category) {
    where.category = { slug: query.category };
  } else if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.brand) {
    where.brand = { contains: query.brand, mode: "insensitive" };
  }
  if (query.minPrice || query.maxPrice) {
    where.pricePerDay = {};
    if (query.minPrice)
      where.pricePerDay.gte = new Prisma.Decimal(query.minPrice);
    if (query.maxPrice)
      where.pricePerDay.lte = new Prisma.Decimal(query.maxPrice);
  }
  if (query.availability) {
    where.availability = query.availability;
  } else {
    // Default: only show available gear to public
    where.availability = "AVAILABLE";
  }

  let orderBy: Prisma.GearItemOrderByWithRelationInput = { createdAt: "desc" };
  if (query.sortBy === "priceAsc") orderBy = { pricePerDay: "asc" };
  else if (query.sortBy === "priceDesc") orderBy = { pricePerDay: "desc" };
  else if (query.sortBy === "oldest") orderBy = { createdAt: "asc" }

  const [items, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
        provider: { select: { id: true, name: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.gearItem.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getGearById = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true, phone: true } },
      reviews: {
        include: {
          customer: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true } },
    },
  });
  if (!gear) throw new AppError(httpStatus.NOT_FOUND, "Gear item not found");
  return gear;
};

export const GearService = {
  createGear,
  updateGear,
  deleteGear,
  getMyGear,
  getAllGear,
  getGearById,
};
