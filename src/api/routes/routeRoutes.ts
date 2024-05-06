import { Router } from "express";
import { getRoutesForDay, getRoutesForStop } from "../controllers/routeControllers";
import { findRoutesFromLocation } from "../controllers/locationControllers";

const departureRouter = Router({});

departureRouter.get("/stop/:stopId", getRoutesForStop);
departureRouter.get("/location/:locationId", findRoutesFromLocation)
departureRouter.get("", getRoutesForDay);

export default departureRouter; 