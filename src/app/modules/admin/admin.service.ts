import { Role, RentalStatus, UserStatus } from "@prisma/client";

import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";


const getAllUsers = async (role?: Role) => {
  return prisma.user.findMany({
    where: role ? { role } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          gearItems: true,
          rentalOrders: true,
          reviews: true,
        },
      },

    },
  });
};




const updateUserStatus = async (userId: string, status: UserStatus) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  }
);
};

const getAllGear = async () => {

  return prisma.gearItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {

      category: true,

      provider: { select: { id: true, name: true, email: true } },
      _count: { select: { reviews: true, rentalItems: true } },
    },
  });
};



const getAllRentals = async (status?: RentalStatus) => {
  return prisma.rentalOrder.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          gearItem: {
            select: { id: true, name: true, provider: { select: { id: true, name: true } } },
          },
        },
      },
      payment: true,
    },
  });
};

const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      rentalOrder: {

        select: {
          id: true,
          customer: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
};



const getDashboardStats = async () => {
  const [

    totalUsers,
    totalCustomers,
    totalProviders,
    totalGear,
    totalRentals,
    totalPayments,
    completedPaymentsAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.gearItem.count(),
    prisma.rentalOrder.count(),
    prisma.payment.count(),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
      _count: { amount: true },
    }),
  ]);



  const revenueByStatus = await prisma.rentalOrder.groupBy({
    by: ["status"],

    _count: { status: true },
  });





  return {
    users: { total: totalUsers, customers: totalCustomers, providers: totalProviders },

    gear: totalGear,
    rentals: totalRentals,
    payments: totalPayments,
    revenue: {
      total: completedPaymentsAgg._sum.amount ?? new Prisma.Decimal(0),

      completedCount: completedPaymentsAgg._count.amount,
    },
    rentalsByStatus: revenueByStatus,
  };
};





export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
  getAllPayments,
  getDashboardStats,
};
