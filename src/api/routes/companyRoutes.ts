import { Router } from "express";
import { getCompanies } from "../controllers/companyControllers";


const companyRouter = Router({});

companyRouter.get("", getCompanies);

export default companyRouter; 