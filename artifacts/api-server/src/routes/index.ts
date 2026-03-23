import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import onboardingRouter from "./onboarding";
import assessmentsRouter from "./assessments";
import scenariosRouter from "./scenarios";
import systemsRouter from "./systems";
import journeyRouter from "./journey";
import brandRouter from "./brand";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use("/", healthRouter);
router.use("/auth", authRouter);
router.use("/onboarding", onboardingRouter);
router.use("/assessments", assessmentsRouter);
router.use("/scenarios", scenariosRouter);
router.use("/systems", systemsRouter);
router.use("/journey", journeyRouter);
router.use("/brand", brandRouter);
router.use("/dashboard", dashboardRouter);
router.use("/admin", adminRouter);
router.use("/openai", openaiRouter);

export default router;
