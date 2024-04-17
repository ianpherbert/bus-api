import { Router } from "express";
import { getDeparturesForStop } from "../controllers/getDeparturesForStop";

const departureRouter = Router({});

departureRouter.get("/:stopId", getDeparturesForStop);

export default departureRouter;