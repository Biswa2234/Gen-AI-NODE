
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_APIKEY,
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function generateResponse() {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);

      const response = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",

        system_instruction:
          "Answer in exactly 20 words using simple Hindi.",

        input: "What is coding?",
        temperature: 0.7,
        max_output_tokens: 100,
      });

      // AI Response
      console.log("\nAI Response:");
      console.log(response.output_text);

      // Token Usage
      const usage = response.usage;

      console.log("\nToken Usage:");
      console.log("Input Tokens:", usage?.total_input_tokens ?? 0);
      console.log("Output Tokens:", usage?.total_output_tokens ?? 0);
      console.log("Total Tokens:", usage?.total_tokens ?? 0);

      return;

    } catch (error) {
      console.error("Error:", error.message);

      if (attempt === maxRetries) {
        console.log("All retry attempts failed.");
        break;
      }

      // Don't retry invalid requests
      if (error.status === 400 || error.status === 401 ||
          error.status === 403) {
        break;
      }

      const delay = 2000 * Math.pow(2, attempt - 1);

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await sleep(delay);
    }
  }
}

generateResponse();
