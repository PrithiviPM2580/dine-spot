import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { envConfig } from "./config/env-config";
import { connectToDatabase } from "./config/db-config";

const app: Application = express();
const PORT: number = envConfig.PORT;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(envConfig.PORT, () => {
      console.log(
        `🚀 Server is running in ${envConfig.NODE_ENV} mode on http://localhost:${envConfig.PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
