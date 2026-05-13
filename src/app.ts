import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import router from "./app/routes/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  console.log("app is running...");
  res.json({
    message: "Successful",
  });
});

// Listen and create the base path & call router
const path: string = "/api/v1";
app.use(path, router);

export default app;
