# India Reel Generator - Frontend

A modern, full-stack React + TypeScript application for creating and sharing AI-powered reels showcasing India's diversity. Built with Vite, Tailwind CSS, and shadcn/ui components.

## 🎯 Features

- **TikTok-style Feed** - Vertical scrolling reel feed with snap-to-view
- **Create Reels** - Intuitive multi-step reel creation flow
- **Discover Page** - Explore trending content and locations
- **Profile Management** - View stats and manage your content
- **Modern UI** - Beautiful gradients, smooth animations, and responsive design
- **Component Library** - Built with shadcn/ui and Radix UI primitives

## 🛠 Tech Stack

- **React 18** + **TypeScript** - Type-safe component development
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **TanStack Query** - Powerful data fetching and caching
- **Wouter** - Lightweight routing (2kb)
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
frontend/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx                 # Main app with router
│       ├── main.tsx                # Entry point
│       ├── index.css               # Tailwind + global styles
│       ├── components/
│       │   ├── feed/
│       │   │   └── reel-card.tsx   # Vertical reel card
│       │   ├── layout/
│       │   │   └── bottom-nav.tsx  # Navigation bar
│       │   └── ui/                 # shadcn components
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── toast.tsx
│       │       └── toaster.tsx
│       ├── pages/
│       │   ├── feed.tsx            # Main feed view
│       │   ├── create.tsx          # Create reel page
│       │   ├── discover.tsx        # Discover page
│       │   ├── profile.tsx         # User profile
│       │   └── not-found.tsx       # 404 page
│       ├── hooks/
│       │   ├── use-content.ts      # Content/reel hooks
│       │   ├── use-mobile.tsx      # Mobile detection
│       │   └── use-toast.ts        # Toast notifications
│       └── lib/
│           ├── utils.ts            # Utility functions
│           └── queryClient.ts      # React Query setup
├── components.json                  # shadcn config
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
├── vite.config.js                  # Vite config
├── postcss.config.js               # PostCSS config
└── package.json
```

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

## 📱 Pages

- **Feed** (`/`) - Vertical scrolling feed
- **Create** (`/create`) - Reel creation
- **Discover** (`/discover`) - Trending content
- **Profile** (`/profile`) - User profile

## 📝 License

MIT
