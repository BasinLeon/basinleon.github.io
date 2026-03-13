#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const baseDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const schemaPath = path.join(baseDir, "schema", "job_posting_schema.json");
const systemPath = path.join(baseDir, "prompts", "system.txt");

function usage() {
  console.error("Usage: node normalize_job.mjs --file <path-to-raw-job-json-or-text> [--model gpt-4o-mini]");
  process.exit(2);
}

const args = process.argv.slice(2);
let file = "";
let model = process.env.OPENAI_MODEL || "gpt-4o-mini";
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--file") file = args[i + 1] || "";
  if (args[i] === "--model") model = args[i + 1] || model;
}
if (!file) usage();
if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is required.");
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(file), "utf8");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const systemPrompt = fs.readFileSync(systemPath, "utf8").trim();

const body = {
  model,
  temperature: 0,
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Process job posting data:\n\n${raw}\n\nNote: job_information.job_description is the most truthful field. If conflicting information is found, prioritize job_information.job_description.`
    }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "job_posting_schema",
      strict: true,
      schema
    }
  }
};

const res = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

if (!res.ok) {
  const err = await res.text();
  console.error(`OpenAI API error (${res.status}): ${err}`);
  process.exit(1);
}

const data = await res.json();
const text = data?.choices?.[0]?.message?.content;
if (!text) {
  console.error("No structured content returned.");
  process.exit(1);
}

try {
  const parsed = JSON.parse(text);
  process.stdout.write(`${JSON.stringify(parsed, null, 2)}\n`);
} catch {
  process.stdout.write(`${text}\n`);
}
