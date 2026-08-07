import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { UserRoutes } from "../app/modules/user/user.route";
import path from "node:path";
import { CategoryRoutes } from "../app/modules/category/category.route";
import { GearRoutes } from "../app/modules/gear/gear.route";
import { RentalRoutes } from "../app/modules/rental/rental.route";
import { PaymentRoutes } from "../app/modules/payment/payment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path:"/categories",
    route:CategoryRoutes
  },
  {
    path:"/gear", 
    route:GearRoutes
  },
  {
    path: "/rentals", 
    route: RentalRoutes
  },
  {
    path: "/payments", 
        route: PaymentRoutes

  }


];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export const allRoutes = router;