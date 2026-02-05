# 🦅 BASIN::ACADEMY - TECH LITERACY CRASH COURSE
**Mission:** Download "Just Enough" Tech Context to survive the interview.
**Time:** 5 Minutes.

---

## 1. THE HTTP CODES (The Traffic Lights of the Internet)
When computers talk, they use numbered codes to say "What happened?"

*   **200 OK:** ✅ "Success!" (Everything worked).
*   **400 Bad Request:** ❌ "You messed up." (You sent bad data).
*   **401 Unauthorized:** 🔒 "Who are you?" (Wrong password/API Key).
*   **403 Forbidden:** 🚫 "You can't go here." (You have a key, but no access).
*   **404 Not Found:** 👻 "Ghost Town." (The page/endpoint doesn't exist).
*   **429 Too Many Requests:** 🛑 "Slow down!" (Rate Limit - you hit the server too fast).
*   **500 Internal Server Error:** 🔥 "I messed up." (The server crashed).

**Interview Cheat Code:**
"If a client has an issue, I check the HTTP Code first. `4xx` means *they* fixed it. `5xx` means *we* fix it."

---

## 2. API (The Waiter)
*   **Concept:** Imagine a restaurant. You (Client) sit at a table. The Kitchen (Server) prepares food (Data).
*   **The API:** The **Waiter**. You tell the waiter what you want (Request). He goes to the kitchen. He brings back the food (Response).
*   **Key:** You don't know how the kitchen cooks. You just need the Waiter (API) to bring the right dish.

---

## 3. JSON (The Menu / The Box)
*   **Concept:** Data has to be packaged so everyone understands it.
*   **JSON:** Just a text format that looks like Python dictionaries.
    ```json
    {
      "name": "Leon",
      "status": "Hired",
      "salary": 180000
    }
    ```
*   **Interview Cheat Code:** "I check the JSON payload to make sure the data structure matches what our system expects."

---

## 4. WEBHOOK (The Doorbell)
*   **Concept:** Instead of asking "Do you have mail?" every 5 seconds (Polling), you install a buzzer.
*   **Webhook:** When the mailman comes, he pushes the button. You get notified instantly.
*   **Use Case:** "When a candidate applies (trigger), send a Slack message (action)."

---

## 5. RECAP FOR INTERVIEW
*   **Q:** "How do you debug?"
*   **A:** "I start with the basics. What's the **Status Code**? Is it Auth (`401`) or a bad request (`400`)? Then I look at the **JSON** to see if they sent the right data fields."

**YOU KNOW THIS NOW.** 🦅
