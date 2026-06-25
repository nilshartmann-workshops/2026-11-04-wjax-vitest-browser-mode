import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import postApi from "./post-api.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req: Request, _res: Response, next: NextFunction) => {
  if ("slow" in req.query) {
    const ms = req.query.slow === "" ? 1200 : Number(req.query.slow);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
  next();
});

app.use("/api", postApi);

const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 7400;
app.listen(port, () => {
  console.log(`Hütly backend running on http://localhost:${port}`);
});
