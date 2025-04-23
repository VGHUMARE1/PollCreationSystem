# 📊 Poll Creation System

### Developed by: **Akanksh Bodakhe** & **Vaishnavi Ghumare**

This is a full-stack, containerized **Poll Creation System** designed and developed as a training project. The system enables users to create, vote, and view polls, featuring secure user authentication and a modular architecture.

---

## 🏢 Project Presentation

The project was successfully presented to the **CTO of Pratiti Technologies**. Following his feedback, significant architectural improvements were implemented.

---

## 🔁 Architecture Enhancement

Based on the CTO’s recommendations, the system architecture was updated to decouple the authentication logic. Now, the **Node.js server functions solely as an authentication microservice**, responsible for:

- **User Login & Logout**
- **JWT Token Generation & Verification**

---

## 🧱 Project Modules

The system is composed of **three main services**, each containerized via Docker:

1. **🔷 Angular Frontend**
   - Built using Angular and served with **Nginx**
   - Provides a user-friendly UI to interact with polls

2. **🟦 Spring Boot Backend**
   - Manages business logic, API endpoints, and data transactions
   - Interacts with MySQL and authenticates requests using the Auth service

3. **🟩 Node.js Authentication Service**
   - Handles **user registration**, **login**, and **JWT validation**
   - Acts as a standalone microservice for secure authentication

---

## 🚀 How to Run the Project

Follow these steps to get the application up and running:

### 1️⃣ Extract and Navigate

Unzip the project and navigate into the root directory:

```bash
unzip PollCreationSystem.zip
cd PollCreationSystem
Run Docker Compose
Use the following command to build and run all containers:
docker compose up --build


The project will be accessible with link http://localhost:4200
