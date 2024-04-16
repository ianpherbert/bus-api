import { configDotenv } from "dotenv";

configDotenv()

export const supabaseUrl = process.env.SUPABASE_URL!;
export const supabaseKey = process.env.SUPABASE_KEY!;
export const PORT = process.env.PORT!;