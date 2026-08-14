import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { envConfig } from "./config/env-config";
import { connectToDatabase } from "./config/db-config";
import router from "./routes/index-route";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/global-error-handler-middleware";

const app: Application = express();
const PORT: number = envConfig.PORT;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(router);

app.use(notFoundHandler);
app.use(globalErrorHandler);

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
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
