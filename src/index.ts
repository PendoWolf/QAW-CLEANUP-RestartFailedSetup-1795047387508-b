import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: patches the Anthropic client so the Tripwise Assistant's turns are recorded.
// Set PENDO_DISABLED=true in the environment to turn it off.
pendo.init({
  apiKey: "25b5bfe4-7995-4638-9ec9-f36942c14af7",
  agentId: "H5Cg1nMilIE77t8LbYZxEx2yhB0",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Flush buffered Pendo events before the process exits.
async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
