# Instagram Clone Coding Practice

This is an Instagram clone frontend using React, TypeScript, Zustand, and shadcn/ui.

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. shadcn/ui Setup

This project uses shadcn/ui components. Initialize the shadcn/ui setup with the following command:

```bash
npx shadcn-ui@latest init
```

During initialization, respond as follows:

- Style: `Default`
- Base color: `Slate`
- Global CSS: `src/index.css`
- CSS variables: `Yes`
- React Server Components: `No`
- Tailwind CSS: `Yes` (already installed)
- Import alias: `@/*`

### 3. Install Required Components

Install the essential shadcn components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add card
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add carousel
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
```

### 4. Run Development Server

```bash
npm run dev
```

## Setting Up Environment Variables

Create a `.env.local` file and set the following environment variables:

```
VITE_API_URL=http://localhost:5001/api
```
