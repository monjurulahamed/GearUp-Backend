
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { makeSlug } from "./category.validation";
import { prisma } from "../../config/prisma";

const createCategory = async (payload: {
  name: string;
  slug?: string;
  icon?: string;
}) => {
  const slug = payload.slug?.trim() || makeSlug(payload.name);

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: payload.name }, { slug }] },
  });
  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category with this name or slug already exists"
    );
  }

  return prisma.category.create({
    data: { name: payload.name, slug, icon: payload.icon },
  });
};

const getAllCategories = async () => {
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { gearItems: true } } },
    }),
    prisma.category.count(),
  ]);
  return { categories, total };
};

const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { gearItems: true } } },
  });
};

const updateCategory = async (
  id: string,
  payload: { name?: string; slug?: string; icon?: string }
) => {
  const data: any = { ...payload };
  if (payload.name && !payload.slug) data.slug = makeSlug(payload.name);
  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: string) => {
  const inUse = await prisma.gearItem.findFirst({
    where: { categoryId: id },
  });
  if (inUse) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category — gear items are linked to it. Reassign or remove them first."
    );
  }
  return prisma.category.delete({ where: { id } });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
