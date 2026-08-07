"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const getAllUsers = async (role) => {
    return prisma_1.prisma.user.findMany({
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
const updateUserStatus = async (userId, status) => {
    return prisma_1.prisma.user.update({
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
    });
};
const getAllGear = async () => {
    return prisma_1.prisma.gearItem.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
            provider: { select: { id: true, name: true, email: true } },
            _count: { select: { reviews: true, rentalItems: true } },
        },
    });
};
const getAllRentals = async (status) => {
    return prisma_1.prisma.rentalOrder.findMany({
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
    return prisma_1.prisma.payment.findMany({
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
    const [totalUsers, totalCustomers, totalProviders, totalGear, totalRentals, totalPayments, completedPaymentsAgg,] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma_1.prisma.user.count({ where: { role: "PROVIDER" } }),
        prisma_1.prisma.gearItem.count(),
        prisma_1.prisma.rentalOrder.count(),
        prisma_1.prisma.payment.count(),
        prisma_1.prisma.payment.aggregate({
            where: { status: "COMPLETED" },
            _sum: { amount: true },
            _count: { amount: true },
        }),
    ]);
    const revenueByStatus = await prisma_1.prisma.rentalOrder.groupBy({
        by: ["status"],
        _count: { status: true },
    });
    return {
        users: { total: totalUsers, customers: totalCustomers, providers: totalProviders },
        gear: totalGear,
        rentals: totalRentals,
        payments: totalPayments,
        revenue: {
            total: completedPaymentsAgg._sum.amount ?? new client_1.Prisma.Decimal(0),
            completedCount: completedPaymentsAgg._count.amount,
        },
        rentalsByStatus: revenueByStatus,
    };
};
exports.AdminService = {
    getAllUsers,
    updateUserStatus,
    getAllGear,
    getAllRentals,
    getAllPayments,
    getDashboardStats,
};
//# sourceMappingURL=admin.service.js.map