# 🛠 Troubleshooting Guide: HUNT MODE v2.0

### n8n is not loading
- Run `docker ps` to see if `hunt-mode-n8n` is running.
- Try `make stop` and `make start` to reset the container.
- Check if port 5678 is being used by another app.

### AI Nodes are failing
- **Error: 401 Unauthorized**: Check your API keys in the n8n Credentials section.
- **Error: 429 Rate Limit**: You might be hitting free-tier limits for Gemini or Groq. Try increasing the delay in the cron node.

### Airtable is not syncing
- Ensure the table name in n8n matches exactly with "Opportunities".
- Verify your Personal Access Token has `data.records:write` scopes.

### Gmail/SMTP issues
- If using Gmail, you MUST use an **App Password**, not your regular password.
- Ensure 2FA is enabled on your Google account.
