import { configDotenv } from "dotenv";

configDotenv()

export const supabaseUrl = process.env.SUPABASE_URL!;
export const supabaseKey = process.env.SUPABASE_KEY!;
export const PORT = process.env.PORT!;
export const dbHost= process.env.DB_HOST!;
export const dbName = process.env.DB_NAME!;
export const dbPort = Number(process.env.DB_PORT!);
export const dbUser = process.env.DB_USER!;
export const dbPassword = process.env.DB_PASSWORD!;