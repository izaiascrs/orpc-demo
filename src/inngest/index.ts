import "dotenv/config";
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "my-application",
  eventKey: process.env.INNGEST_EVENT_KEY,
  env: "Production"
});

const sleepFunction =  inngest.createFunction(
  { id: "test-hello-world" },
  { event: "test/hello.world" },
  async ({ event, step, runId }) => {
     await step.sleep("wait-10-seconds", "10s");
    return {
      event: event.name,
      runId,
      ok: true,
    }
  }
);

export const functions = [sleepFunction]
