import { Router } from "express";
import { findLocation } from "../controllers/locationControllers";
const locationRouter = Router({});

locationRouter.get("", findLocation);

export default locationRouter; 