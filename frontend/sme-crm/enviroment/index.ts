import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export interface EnviromentVariables {
  googleMapsApiKey: string;
}

export const getEnviromentVariables = (): EnviromentVariables => {
  const variables = {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  };

  return variables;
};