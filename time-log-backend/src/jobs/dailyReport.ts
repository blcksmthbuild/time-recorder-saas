import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { sendTo } from "../module/email.ts";
import { getDailyReport } from "../module/reports.ts";

const prisma = new PrismaClient();

function buildSummaryHtml(
  total: number,
  byUser: Record<string, number>,
  byProject: Record<string, number>,
) {
  const userRows = Object.entries(byUser)
    .map(
      ([user, hours]) =>
        `<tr><td>${user}</td><td style="text-align:right">${hours.toFixed(2)}</td></tr>`,
    )
    .join("");
  const projectRows = Object.entries(byProject)
    .map(
      ([project, hours]) =>
        `<tr><td>${project}</td><td style="text-align:right">${hours.toFixed(2)}</td></tr>`,
    )
    .join("");

  return `
  <h2>Daily Time Report</h2>
  <p>Total hours: <b>${total.toFixed(2)}</b></p>
  <h3>By User</h3>
  <table cellpadding="6" cellspacing="0" border="1">
    <tr><th>User</th><th>Hours</th></tr>
    ${userRows || '<tr><td colspan="2">No data</td></tr>'}
  </table>
  <h3>By Project</h3>
  <table cellpadding="6" cellspacing="0" border="1">
    <tr><th>Project</th><th>Hours</th></tr>
    ${projectRows || '<tr><td colspan="2">No data</td></tr>'}
  </table>
  `;
}

export function startDailyReportJob(server: FastifyInstance) {
  cron.schedule("59 23 * * *", async () => {
    try {
      const today = new Date();
      const from = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
      );
      const to = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
      );
      server.log.info({ from, to }, "Getting daily report");

      const { total, byUser, byProject } = await getDailyReport(from, to);

      server.log.info({ total, byUser, byProject }, "Daily report");
      const html = buildSummaryHtml(total, byUser, byProject);

      const toList = process.env.REPORT_EMAIL_TO;

      await sendTo(
        `Daily Time Report - ${from.toISOString().slice(0, 10)}`,
        { html },
        toList ? toList.split(",") : [],
      );
    } catch (err) {
      server.log.error({ err }, "Failed to send daily report email");
    }
  });
}
