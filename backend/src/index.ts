import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT: number = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(
    `Server is running in the ${process.env.NODE_ENV} mode on http://localhost:${PORT}`,
  );
});

export default app;
