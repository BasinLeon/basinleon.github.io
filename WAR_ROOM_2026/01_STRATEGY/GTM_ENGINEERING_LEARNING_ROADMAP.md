# GTM Engineering Learning Roadmap
## Complete Guide to Revenue Systems Architecture

**Last Updated:** January 2026  
**Author:** Leon Basin  
**Level:** Beginner → Advanced → Architect

---

## 🎯 Core Philosophy

GTM Engineering = **Systems Thinking + Code + Data + Automation**

You're not just running sales—you're building the infrastructure that scales revenue without scaling headcount.

---

## 📚 Phase 1: Foundation (Months 1-3)

### **Python Fundamentals**
**Why:** Python is the lingua franca of GTM automation. Every tool has a Python SDK.

**Learning Path:**
1. **Basics (Week 1-2)**
   - Variables, data types, functions
   - Lists, dictionaries, loops
   - File I/O (reading CSVs, JSON)
   - **Practice:** Write a script that reads a CSV of leads and prints company names

2. **APIs & HTTP (Week 3-4)**
   - `requests` library
   - REST API concepts
   - Authentication (API keys, OAuth)
   - Error handling
   - **Practice:** Connect to HubSpot API and fetch contacts

3. **Data Processing (Week 5-6)**
   - `pandas` for dataframes
   - `json` for API responses
   - Data cleaning and transformation
   - **Practice:** Merge two lead lists, deduplicate, enrich with company data

4. **Automation (Week 7-8)**
   - `schedule` library for cron jobs
   - `logging` for debugging
   - Environment variables (`python-dotenv`)
   - **Practice:** Daily script that syncs Salesforce → HubSpot

**Resources:**
- **Free:** Python.org tutorial, Real Python
- **Paid:** Automate the Boring Stuff with Python
- **Practice:** Build a lead enrichment script using Apollo API

---

### **SQL Fundamentals**
**Why:** All GTM data lives in databases. You need to query it, transform it, and report on it.

**Learning Path:**
1. **Basics (Week 1-2)**
   - SELECT, FROM, WHERE
   - JOINs (INNER, LEFT, RIGHT)
   - GROUP BY, HAVING
   - ORDER BY, LIMIT
   - **Practice:** Query Salesforce to find all opportunities created this month

2. **Advanced Queries (Week 3-4)**
   - Subqueries and CTEs (Common Table Expressions)
   - Window functions (ROW_NUMBER, RANK, SUM OVER)
   - Aggregations (COUNT, SUM, AVG, MAX, MIN)
   - **Practice:** Calculate pipeline velocity by stage

3. **Data Modeling (Week 5-6)**
   - Understanding schemas (Salesforce, HubSpot)
   - Normalization vs denormalization
   - Date/time functions
   - **Practice:** Build a revenue dashboard query

**Resources:**
- **Free:** SQLBolt, Mode Analytics SQL Tutorial
- **Practice:** Use dbt (data build tool) to transform raw CRM data

---

## 🔧 Phase 2: GTM Tools (Months 4-6)

### **Clay.com**
**Why:** The most powerful data enrichment and workflow automation tool for GTM.

**Learning Path:**
1. **Basics (Week 1-2)**
   - Understanding tables and columns
   - Enrichment APIs (Clearbit, Apollo, ZoomInfo)
   - Formulas and transformations
   - **Practice:** Enrich 100 leads with company data, emails, phone numbers

2. **Workflows (Week 3-4)**
   - Triggers and actions
   - Conditional logic
   - Loops and iterations
   - **Practice:** Build a workflow that enriches → scores → routes leads

3. **Advanced (Week 5-6)**
   - API integrations
   - Custom functions
   - Webhooks
   - **Practice:** Build a Clay → Salesforce sync workflow

**Resources:**
- **Free:** Clay University, Clay Community
- **Practice:** Replicate your manual lead research process in Clay

---

### **Apollo.io**
**Why:** The best prospecting database. 275M+ contacts, 70M+ companies.

**Learning Path:**
1. **Basics (Week 1-2)**
   - Search and filters
   - Lists and sequences
   - Exporting data
   - **Practice:** Build a list of 500 target accounts in your ICP

2. **API Integration (Week 3-4)**
   - Apollo API authentication
   - Searching via API
   - Bulk operations
   - **Practice:** Build a Python script that searches Apollo and exports to CSV

3. **Automation (Week 5-6)**
   - Apollo + Clay integration
   - Apollo + Salesforce sync
   - Lead scoring with Apollo data
   - **Practice:** Automated daily sync: Apollo → Clay → Salesforce

**Resources:**
- **Free:** Apollo Academy, Apollo API Docs
- **Practice:** Build a "lead discovery engine" using Apollo API

---

## 🚀 Phase 3: Advanced GTM Engineering (Months 7-12)

### **CRM APIs (Salesforce, HubSpot)**
**Why:** You need to read/write data to your CRM programmatically.

**Learning Path:**
1. **Salesforce API (Week 1-3)**
   - SOQL queries
   - REST API vs Bulk API
   - Object relationships
   - **Practice:** Build a script that creates opportunities from enriched leads

2. **HubSpot API (Week 4-6)**
   - Contacts, Companies, Deals APIs
   - Custom properties
   - Webhooks
   - **Practice:** Build a HubSpot → Clay sync for lead enrichment

3. **CRM Data Modeling (Week 7-8)**
   - Understanding object relationships
   - Custom fields and properties
   - Data validation and cleaning
   - **Practice:** Build a unified data model across Salesforce + HubSpot

**Resources:**
- **Free:** Salesforce Trailhead, HubSpot API Docs
- **Practice:** Build a "CRM health checker" that validates data quality

---

### **Workflow Automation (n8n, Zapier, Make)**
**Why:** Connect tools without writing code (but you'll still write code for complex logic).

**Learning Path:**
1. **n8n (Week 1-2)**
   - Self-hosted workflow automation
   - HTTP requests, webhooks
   - Conditional logic
   - **Practice:** Build a workflow: New lead → Enrich → Score → Route to SDR

2. **Advanced Automation (Week 3-4)**
   - Error handling and retries
   - Scheduled workflows
   - Data transformation
   - **Practice:** Build a daily pipeline sync: Salesforce → n8n → Clay → Slack

**Resources:**
- **Free:** n8n Docs, Zapier University
- **Practice:** Replace 3 manual processes with automated workflows

---

### **Data Engineering for GTM**
**Why:** GTM data is messy. You need to clean, transform, and model it.

**Learning Path:**
1. **ETL Basics (Week 1-2)**
   - Extract: APIs, CSVs, databases
   - Transform: pandas, SQL
   - Load: Databases, data warehouses
   - **Practice:** Build an ETL pipeline: Apollo → Transform → Salesforce

2. **dbt (Data Build Tool) (Week 3-4)**
   - SQL transformations
   - Models and tests
   - Documentation
   - **Practice:** Build a dbt project that models your CRM data

3. **Data Warehouses (Week 5-6)**
   - Snowflake, BigQuery, Redshift
   - ELT vs ETL
   - **Practice:** Load CRM data into a warehouse and build reports

**Resources:**
- **Free:** dbt Learn, Fivetran Academy
- **Practice:** Build a "single source of truth" for all GTM data

---

### **AI/LLM Integration (LangChain, OpenAI, Claude)**
**Why:** AI can automate research, write emails, score leads, and more.

**Learning Path:**
1. **LLM Basics (Week 1-2)**
   - OpenAI API
   - Prompt engineering
   - Token limits and costs
   - **Practice:** Build a script that generates personalized emails from company data

2. **LangChain (Week 3-4)**
   - Chains and agents
   - Vector stores
   - Document loaders
   - **Practice:** Build a "company research agent" that summarizes prospects

3. **Production AI (Week 5-6)**
   - Error handling
   - Rate limiting
   - Cost optimization
   - **Practice:** Build a production-ready lead scoring system using LLMs

**Resources:**
- **Free:** OpenAI Cookbook, LangChain Docs
- **Practice:** Build an AI-powered SDR that researches and writes emails

---

## 🎨 Phase 4: Specialized Skills (Months 13-18)

### **Streamlit for Dashboards**
**Why:** Build interactive dashboards without frontend skills.

**Learning Path:**
- Streamlit basics (widgets, charts, layouts)
- Data visualization (plotly, matplotlib)
- **Practice:** Build a GTM dashboard showing pipeline, conversion rates, SDR performance

**Resources:** Streamlit Docs, Streamlit Gallery

---

### **Airflow/Prefect for Workflow Orchestration**
**Why:** Schedule and monitor complex data pipelines.

**Learning Path:**
- DAGs (Directed Acyclic Graphs)
- Task dependencies
- Error handling and retries
- **Practice:** Build an Airflow DAG that runs daily: Enrich leads → Score → Update CRM

**Resources:** Airflow Docs, Prefect Docs

---

### **Revenue Operations (RevOps)**
**Why:** Understand the business side of GTM systems.

**Learning Path:**
- Pipeline management
- Forecasting models
- Attribution and reporting
- **Practice:** Build a revenue forecasting model using historical data

**Resources:** RevOps Co-op, Revenue.io Academy

---

## 🛠️ Essential Tools & Technologies

### **Must Know:**
- **Python** (automation, APIs, data processing)
- **SQL** (data analysis, reporting)
- **Clay** (data enrichment, workflows)
- **Apollo** (prospecting, data)
- **Salesforce/HubSpot APIs** (CRM integration)
- **n8n/Zapier** (workflow automation)
- **Git** (version control)

### **Should Know:**
- **LangChain/OpenAI** (AI automation)
- **Streamlit** (dashboards)
- **dbt** (data transformation)
- **Airflow/Prefect** (orchestration)
- **PostgreSQL/MySQL** (databases)
- **Docker** (containerization)

### **Nice to Know:**
- **React/JavaScript** (custom UIs)
- **FastAPI/Flask** (APIs)
- **Snowflake/BigQuery** (data warehouses)
- **Looker/Tableau** (BI tools)
- **Kubernetes** (deployment)

---

## 📖 Learning Resources

### **Free Resources:**
1. **Python:**
   - Python.org official tutorial
   - Real Python
   - Automate the Boring Stuff with Python (book)

2. **SQL:**
   - SQLBolt
   - Mode Analytics SQL Tutorial
   - LeetCode SQL problems

3. **GTM Tools:**
   - Clay University
   - Apollo Academy
   - Salesforce Trailhead
   - HubSpot Academy

4. **APIs:**
   - REST API Tutorial
   - Postman Learning Center

### **Paid Resources:**
1. **Courses:**
   - DataCamp (Python, SQL)
   - Udemy (GTM-specific courses)
   - Coursera (Data Engineering)

2. **Books:**
   - "Python for Data Analysis" by Wes McKinney
   - "Designing Data-Intensive Applications" by Martin Kleppmann
   - "The Sales Acceleration Formula" by Mark Roberge

---

## 🎯 Practice Projects (Build These)

### **Beginner:**
1. **Lead Enrichment Script**
   - Read CSV of company names
   - Enrich with Apollo API
   - Export to new CSV

2. **CRM Sync Script**
   - Sync contacts from HubSpot → Salesforce
   - Handle duplicates
   - Log errors

3. **Simple Dashboard**
   - Query Salesforce for pipeline data
   - Display in Streamlit dashboard

### **Intermediate:**
1. **Automated Lead Scoring**
   - Score leads using company data
   - Update CRM with scores
   - Route high-score leads to SDRs

2. **Email Sequence Automation**
   - Generate personalized emails using LLMs
   - Send via email API
   - Track opens/clicks

3. **Pipeline Health Monitor**
   - Daily report on pipeline health
   - Alert on anomalies
   - Slack notifications

### **Advanced:**
1. **Complete GTM Signal Engine**
   - Detect buying signals (job postings, funding, news)
   - Enrich and score leads
   - Automatically create opportunities
   - Route to appropriate SDR

2. **Revenue Forecasting System**
   - Historical pipeline data
   - ML-based forecasting
   - Dashboard with predictions

3. **AI-Powered SDR Assistant**
   - Research prospects
   - Generate personalized emails
   - Schedule follow-ups
   - Update CRM

---

## 🚀 Career Path: GTM Engineer

### **Junior GTM Engineer (0-2 years)**
- Automate manual processes
- Build simple integrations
- Maintain existing workflows
- **Skills:** Python basics, SQL basics, API integration

### **Mid-Level GTM Engineer (2-4 years)**
- Design data pipelines
- Build complex automations
- Optimize CRM workflows
- **Skills:** Advanced Python, dbt, workflow orchestration

### **Senior GTM Engineer (4-6 years)**
- Architect GTM systems
- Lead technical projects
- Mentor junior engineers
- **Skills:** System design, architecture, leadership

### **Principal/Staff GTM Engineer (6+ years)**
- Set technical direction
- Build platforms and frameworks
- Drive innovation
- **Skills:** Platform engineering, technical strategy

---

## 💡 Key Principles

1. **Start with the problem, not the tool**
   - What manual process can you automate?
   - What data do you need to make decisions?

2. **Build incrementally**
   - Start simple, add complexity
   - Test frequently
   - Iterate based on feedback

3. **Document everything**
   - Code comments
   - README files
   - Process documentation

4. **Think in systems**
   - How do tools connect?
   - What are the dependencies?
   - Where are the failure points?

5. **Measure impact**
   - Time saved
   - Revenue generated
   - Headcount replaced

---

## 🎓 Next Steps

1. **Pick one skill** (start with Python)
2. **Build one project** (lead enrichment script)
3. **Automate one process** (manual lead research)
4. **Measure the impact** (time saved, leads generated)
5. **Repeat** (move to next skill)

---

## 📞 Questions?

- **GitHub:** [github.com/BasinLeon](https://github.com/BasinLeon)
- **Website:** [basinleon.github.io](https://basinleon.github.io)
- **Email:** lbasin23@gmail.com

---

**Remember:** GTM Engineering is about building systems that work while you sleep. Start small, build incrementally, and always measure impact.

**You're not just learning tools—you're learning to architect revenue systems.**
