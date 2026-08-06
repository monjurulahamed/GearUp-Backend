import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";


const router=Router();
const moduleRouter=[
    {path:"/auth",Router:AuthRoutes}
]
export const allRoutes = router;