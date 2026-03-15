# AI Study Abroad Platform

This is a monorepo containing:
- `/frontend`: Next.js web application
- `/backend`: Express.js API with Prisma (Serverless-ready for Vercel)

## Deployment Note
When deploying to Vercel, create two separate projects:
1. One for the **Backend** (Root Directory: `backend`)
2. One for the **Frontend** (Root Directory: `frontend`)

## Key Features
- **AI Advisor**: Context-aware agent reading student profile and recommendations.
- **Smart Recommendations**: University matching based on score, budget, and preference.
- **Admin Dashboard**: Comprehensive CRUD for universities and student management.
- **Rich Interaction**: Interactive sliders for profile setup and full Markdown AI support.
