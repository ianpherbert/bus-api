import { Router } from "express";
import { getRoutesForStop } from "../controllers/routeControllers";

const departureRouter = Router({});

departureRouter.get("/stop/:stopId", getRoutesForStop);

export default departureRouter; 