#!/bin/bash
# 🦅 NEXUS::OPERATOR - Setup Script

echo "============================================================"
echo "      BASIN::NEXUS | THE SOVEREIGN OPERATOR CONSOLE"
echo "============================================================"
echo "STATUS: Initializing Layer 01 Substrate..."

# Install dependencies
pip install -r requirements.txt

echo "✅ Dependencies Loaded."
echo "✅ Security Protocols Established."
echo ""
echo "COMMANDS:"
echo "  - run_audit <company>  : Trigger a local signal audit"
echo "  - run_server           : Start the Mirror API locally"
echo ""
echo "SITREP: All systems nominal. Ready for GTM Operation."
echo "============================================================"

# Alias for easy use
alias run_audit="python -c \"import os; from api.index import nexus_refinery_audit; import sys; print(nexus_refinery_audit(sys.argv[1]))\""
alias run_server="uvicorn api.index:app --reload"
