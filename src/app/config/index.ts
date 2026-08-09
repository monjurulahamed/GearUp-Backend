import {  configDotenv } from "dotenv";
import { env } from "node:process";

configDotenv()
const config={
    
    PORT:env.PORT,
    DATABASAE_URL: env.DATABASAE_URL,
}
export default config;