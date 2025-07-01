import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export const genAI = new GoogleGenerativeAI(process.env.GEMIMI_API_KEY);