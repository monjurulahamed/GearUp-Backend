"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const express_1 = require("express");
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const category_route_1 = require("../app/modules/category/category.route");
const gear_route_1 = require("../app/modules/gear/gear.route");
const rental_route_1 = require("../app/modules/rental/rental.route");
const payment_route_1 = require("../app/modules/payment/payment.route");
const review_route_1 = require("../app/modules/review/review.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes
    },
    {
        path: "/gear",
        route: gear_route_1.GearRoutes
    },
    {
        path: "/rentals",
        route: rental_route_1.RentalRoutes
    },
    {
        path: "/payments",
        route: payment_route_1.PaymentRoutes
    },
    { path: "/reviews",
        route: review_route_1.ReviewRoutes
    },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.allRoutes = router;
//# sourceMappingURL=index.js.map