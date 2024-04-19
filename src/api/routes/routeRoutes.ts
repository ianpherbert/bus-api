import { Router } from "express";
import { getRoutesForDay, getRoutesForStop } from "../controllers/routeControllers";

const departureRouter = Router({});

departureRouter.get("/stop/:stopId", getRoutesForStop);
departureRouter.get("", getRoutesForDay);

export default departureRouter; 