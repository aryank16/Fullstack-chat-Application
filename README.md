<p align="center">
  <img src="https://www.eraneos.com/de/wp-content/uploads/sites/2/2024/03/eraneos_Logo-and-BrandSign-black.png" alt="Project Logo" width="350"/>
</p>

# Eraneos Analytics Case: Intelligent Chat Frontend

**Dear Candidate,**

Thank you for taking the time to demonstrate your technical and product-thinking skills through this case. It is inspired by a previous client project and simulates the expectations of a **Full Stack Engineer** at Eraneos Analytics.
You will receive a minimal backend and a starter frontend so you can focus on building a modern chat interface that integrates with provided APIs.

## The Case: Intelligent Chat Frontend

### Introduction

Imagine you're a **Full Stack Engineer** at Eraneos Analytics working on an internal assistant for a banking client. Your task is to implement the **user-facing web frontend** for a secure internal chatbot. The application must ensure that **users authenticate before they can send messages**, and provide a smooth, accessible chat experience with a **Chat Window**, **Sidebar**, and **Quick Actions**.

You will connect your UI to the provided backend services and demonstrate a cohesive solution suitable for enterprise environments.

---

### Procedure

1. You receive a `.zip` containing the project files, including this `README.md`.
2. Understand the requirements and familiarize yourself with the provided codebase.
3. Create an upstream private Git repository to demonstrate your progress clearly during your presentation.
4. Allocate roughly **8 hours** to work on this case (7h on the code, 1h on the presentation).
5. Provide the Git repository link and your final presentation at least **24 hours before** your technical interview.

   * Ensure your repository is set to **private**, and grant access to the technical interviewers.

---


### Evaluation Criteria

The time allocated for the case is approximately 7 hours. Perfection is not required; focus on delivering a functional, coherent solution. We will assess:

* Frontend implementation quality (structure, state management, components, styling, accessibility).
* Understanding of the backend and the required adjustments
* API integration (auth flow, error handling, robustness).
* Code quality (readability, tests, linting, sensible abstractions).
* Effective use of modern Python development practices.
* Presentation: clarity of communication and prioritization.

#### Additional Recommendations

* Prioritize an **end-to-end working chat** over polishing edge cases.
* Recognize and highlight areas for potential improvement and share your reasoning either through code comments or verbally during the presentation.
* Keep the UI simple, consistent, and accessible; avoid unnecessary complexity.
* Thoughtful overengineering is encouraged if contextualized appropriately. Show us what you can do.
* Have fun coding!

---

### Additional Guidelines

#### Local development
##### Backend
- create your `uv` environment
- run `python generate_data.py`


* **Setup the backend using uv:**

  ```bash
  cd backend
  uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
  ```

##### Frontend
- install dependencies with `npm install` or `yarn install`

* **Start the frontend:**

  ```bash
  cd frontend
  npm run dev
  ```

#### Production setup

* Docker Compose configuration provided to start the containerized app:

  ```bash
  docker compose up -d
  ```


We look forward to your solutions and creativity. Enjoy the challenge!

---

##### Copyright (C) 2025 Eraneos Analytics Germany GmbH - All Rights Reserved
