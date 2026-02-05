.PHONY: setup start stop clean help

help:
	@echo "HUNT MODE v2.0 - Management Menu"
	@echo "--------------------------------"
	@echo "make setup    - Run the automated setup script"
	@echo "make start    - Start the HUNT MODE Docker engine"
	@echo "make stop     - Stop the engine"
	@echo "make status   - Check health of the AI agents"
	@echo "make clean    - Wipe local data and reset"

setup:
	@chmod +x setup.sh
	@./setup.sh

start:
	@docker-compose up -d
	@echo "HUNT MODE is live at http://localhost:5678"

stop:
	@docker-compose down

status:
	@docker ps --filter name=hunt-mode-n8n

clean:
	@docker-compose down -v
	@rm -rf n8n_data
