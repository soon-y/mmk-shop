# MMK Shop
<a href="https://mmk-shop.vercel.app/" target="_blank">
<img src="public/mmk-icon.svg" alt="icon" width="100" /><br>
</a> 

## Introduction
MMK Shop is a full-stack e-commerce demo built with a modular architecture. It provides a Shop frontend for customers, an Admin dashboard for management, a Backend server for handling business logic and APIs, and a Database for persistent data storage.

    ┌─────────────────┐         ┌──────────────────┐
    │ Shop (Frontend) │         │ Admin (Frontend) │
    └─────────────────┘         └──────────────────┘
              ▲                           ▲
              │  API Requests / Responses │ 
              └─────────────┬─────────────┘
                            ▼             
                  ┌──────────────────┐  
                  │ Backend (Server) │ 
                  └─────────┬────────┘
                            │ Read/Write Data
                            ▼
                    ┌────────────────┐
                    │    Database    │
                    └────────────────┘

## Features
* displays products, prices, and descriptions.
* lets customers add items to cart, checkout, and pay.
* provides an easy-to-use interface for browsing and purchasing.
* sends requests to the backend to get product data, create orders.

## Tech Stack
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

| Layer        | Technology |
| ------------ | ---------- |
| Framework    | [React.js](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) |
| Deployment   | [Vercel](https://vercel.com/) |
| Database      | [Supabase](https://supabase.com/) (PostgreSQL)                              |
| Icons        | [Lucide](https://lucide.dev/) |
