#!/bin/bash
echo "Starting deployment..."
git add index.html
git commit -m "UI Upgrade: Billboard & Projects"
git push
echo "Deployment done."
