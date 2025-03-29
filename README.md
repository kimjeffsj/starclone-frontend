# StarClone (Instagram Clone Frontend)

A modern Instagram clone frontend built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: User login and registration
- 📱 **User Interface**: Instagram-like UI with responsive design
- 📝 **Posts**: Create, view, like, and comment on posts
- 👥 **Profiles**: View user profiles, follow/unfollow users
- 🖼️ **Media**: Upload and display images
- 🌓 **UI Components**: Beautiful UI with shadcn/ui components

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16+)
- [StarClone Backend](https://github.com/your-username/starclone-backend) running

### Installation

1. Clone the frontend repository

```bash
git clonehttps://github.com/kimjeffsj/starclone-frontend.git
cd starclone-frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (create a `.env` file)

```
VITE_API_URL=http://localhost:5001/api
```

4. Start the development server

```bash
npm run dev
```

The app will open in your browser at `http://localhost:3001`.

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── auth/          # Authentication components
  │   ├── post/          # Post-related components
  │   ├── profile/       # Profile components
  │   ├── shared/        # Shared/common components
  │   └── ui/            # UI components (shadcn/ui)
  ├── pages/             # Page components
  ├── store/             # Zustand state stores
  ├── types/             # TypeScript type definitions
  └── utils/             # Utility functions
```

## Main Pages

- **Auth Page**: Login and registration
- **Home Page**: Feed of posts
- **Profile Page**: User profiles with posts and follower/following info
- **Post Detail**: Individual post view with comments
- **Post Form**: Create and edit posts

## UI Components

This project uses shadcn/ui components, which are built on top of Radix UI and styled with Tailwind CSS. To add more components:

```bash
npx shadcn@latest add [component-name]
```

## Connecting with Backend

This frontend is designed to work with the [StarClone Backend](https://github.com/your-username/starclone-backend) repository. Make sure to set the `VITE_API_URL` environment variable to point to your backend API.
