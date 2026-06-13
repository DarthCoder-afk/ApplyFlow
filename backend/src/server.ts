import app from "./app";
import dotenv from "dotenv";
import { env } from "./config/env";

dotenv.config();

const port = env.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});