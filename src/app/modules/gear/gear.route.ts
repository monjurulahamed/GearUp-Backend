import { Router } from "express";
import { GearController } from "./gear.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  createGearZodSchema,
  gearFilterZodSchema,
  updateGearZodSchema,
} from "./gear.validation";

const router = Router();

// ----- Public -----
router.get(
  "/",
  validateRequest(gearFilterZodSchema),
  GearController.getAllGear
);
router.get("/:id", GearController.getGearById);

// ----- Provider -----
router.post(
  "/provider",
  checkAuth("PROVIDER"),
  validateRequest(createGearZodSchema),
  GearController.createMyGear
);
router.get("/provider/me", checkAuth("PROVIDER"), GearController.getMyGear);
router.put(
  "/provider/:id",
  checkAuth("PROVIDER"),
  validateRequest(updateGearZodSchema),
  GearController.updateMyGear
);
router.delete(
  "/provider/:id",
  checkAuth("PROVIDER"),
  GearController.deleteMyGear
);

export const GearRoutes = router;
