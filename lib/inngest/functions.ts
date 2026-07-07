import { Query } from "node-appwrite";
import { inngest } from "@/lib/inngest/client";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, listDocuments, updateDocument } from "@/lib/appwrite/db";
import { failPublishJob, markPostAsPosted } from "@/lib/publishing/demo-publisher";

export const publishScheduledPost = inngest.createFunction(
  { id: "publish-scheduled-post", name: "Publish scheduled post", retries: 3 },
  { event: "post/scheduled" },
  async ({ event, step }) => {
    const postId = event.data.postId as string;
    const runAt = event.data.runAt as string | undefined;

    if (runAt) {
      await step.sleepUntil("wait-until-scheduled-time", new Date(runAt));
    }

    await step.run("mark-job-running", async () => {
      const jobs = await listDocuments<any>(COLLECTIONS.publishJobs, [
        Query.equal("post_id", postId),
        Query.equal("status", "queued"),
        Query.limit(25),
      ]);

      await Promise.all(jobs.map((job) => updateDocument(COLLECTIONS.publishJobs, job.$id, {
        status: "running",
        started_at: new Date().toISOString(),
      })));
    });

    try {
      return await step.run("publish-demo-post", async () => markPostAsPosted(postId));
    } catch (error) {
      await step.run("mark-publish-failed", async () => failPublishJob(postId, error));
      throw error;
    }
  }
);

export const sweepDuePosts = inngest.createFunction(
  { id: "sweep-due-posts", name: "Sweep due posts", retries: 1 },
  { event: "posts/sweep.requested" },
  async ({ step }) => {
    const dueJobs = await step.run("load-due-jobs", async () => {
      const jobs = await listDocuments<any>(COLLECTIONS.publishJobs, [
        Query.equal("status", "queued"),
        Query.lessThanEqual("run_at", new Date().toISOString()),
        Query.orderAsc("run_at"),
        Query.limit(25),
      ]);

      return jobs.map((job) => ({ post_id: job.post_id, run_at: job.run_at }));
    });

    for (const job of dueJobs) {
      await step.sendEvent(`publish-${job.post_id}`, {
        name: "post/scheduled",
        data: { postId: job.post_id, runAt: job.run_at },
      });
    }

    return { queued: dueJobs.length };
  }
);

export const dailyAIDraftReminder = inngest.createFunction(
  { id: "daily-ai-draft-reminder", name: "Daily AI draft reminder", retries: 1 },
  { cron: "0 12 * * *" },
  async ({ step }) => {
    return await step.run("record-daily-agent-pulse", async () => {
      await createDocument(COLLECTIONS.agentEvents, {
        event_type: "daily_ai_draft_reminder",
        payload: JSON.stringify({
          note: "Phase 1 cron pulse. Phase 2 can generate daily drafts with OpenAI and save them as posts.",
        }),
      });
      return { ok: true };
    });
  }
);

export const functions = [publishScheduledPost, sweepDuePosts, dailyAIDraftReminder];
