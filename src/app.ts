import express from "express";
import stopRouter from "./api/routes/stopRoutes";
import { PORT } from "./variables";
import includeTimestamp from "./api/middleware/timeStamp";
import departureRouter from "./api/routes/routeRoutes";
import { postgresClient } from "./database/DBcontroller";
import cacheCalls from "./api/middleware/cacheCalls";
import locationRouter from "./api/routes/locationRoutes";
import companyRouter from "./api/routes/companyRoutes";

const app = express();

app.listen(PORT, async () => {
  console.info(`connected at: ${PORT}`)
  await postgresClient.connect();
  console.info(`Db connected as user: ${postgresClient.user}`)
}).on("error", (error) => {
  console.error("Error while connecting", error.message)
  throw new Error(error.message);
});

app.use(includeTimestamp, cacheCalls);
app.use("/stop", stopRouter);
app.use("/route", departureRouter);
app.use("/location", locationRouter);
app.use("/company", companyRouter);
app.get("/ping", (_a, b) => {
  return b.status(200).json({ message: "OK" })
})
app.get("/endpoints", (_, res) => res.json({
  stopRouter: stopRouter.stack.map(it => it.route.path),
  departureRouter: departureRouter.stack.map(it => it.route.path),
  locationRouter: locationRouter.stack.map(it => it.route.path),
  companyRouter: companyRouter.stack.map(it => it.route.path)
}))


export default app;