
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_APIKEY,
});

async function getModels() {
  try {
    const result = await ai.models.list();

    for await (const model of result) {
      console.log(model.name);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getModels();
