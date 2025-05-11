import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();
const env = cleanEnv(process.env, {
  API_ENDPOINT: str(),
  PORT: port(),
  DB_PATH: str(),
});

export const { API_ENDPOINT, DB_PATH, PORT } =
  env;
