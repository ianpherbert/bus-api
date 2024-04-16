import { Router } from "express";
import { getStop, searchStop } from "../controllers/stopControllers";

const stopRouter = Router({});

stopRouter.get("/", searchStop);
stopRouter.get("/:stopId", getStop);

export default stopRouter;