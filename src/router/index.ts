import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((item) => {
  router.use(item.path, item.route);
});

export const allRoutes = router;