# 🏗 Development & Customization

HUNT MODE is designed to be extensible.

## Modifying the Search Logic
The `Job Discovery` nodes currently use ScraperAPI placeholders. If you have direct LinkedIn API access or want to use a different service (like Proxycurl), simply swap the URL in the **HTTP Request** node.

## Adding New AI Voices
You can add a **Claude** node or a local **Ollama** node to the workflow to compare outputs before they hit the CRM.

## Scripting
The `./local_files` volume is mapped to the n8n container. You can place your existing Python scripts (`enrich_company.py`) in that folder and call them from an **Execute Command** node inside n8n.
