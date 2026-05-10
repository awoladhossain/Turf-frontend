# TurfBook Frontend

TurfBook Frontend is a modern, high-performance turf booking web application built with Next.js. It provides a clean and responsive interface for users to discover turfs, manage bookings, switch languages, and interact with authentication-driven features.

## Features

- **Multilingual experience**: Supports English and Bangla using `react-i18next`.
- **Authentication flow**: Includes protected routes, auth service utilities, typed auth state, and token-aware API handling.
- **Centralized state management**: Uses Redux Toolkit through the `store/` layer for auth, booking, and UI state.
- **Modern UI system**: Built with Tailwind CSS, shadcn-style UI components, Radix UI primitives, and Lucide icons.
- **Typed application code**: Uses TypeScript types for API responses, auth, booking, and turf-related data.
- **API service layer**: Uses Axios with a shared API instance configured through environment variables.
- **Form-ready tooling**: Includes React Hook Form and Zod for scalable form validation.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn components, Radix UI |
| State Management | Redux Toolkit, React Redux |
| API Client | Axios |
| Internationalization | i18next, react-i18next |
| Forms and Validation | React Hook Form, Zod |
| Icons | Lucide React |
| Payments | Stripe packages included |
| Linting | ESLint |

## Project Structure

```text
.
├── app/                  # Next.js app routes, layout, pages, and global styles
├── components/           # Reusable common and UI components
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities and i18n setup
├── locales/              # Translation files for English and Bangla
├── public/               # Static assets
├── services/             # API client and service modules
├── store/                # Redux store, slices, and typed hooks
├── types/                # Shared TypeScript type definitions
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/turfbook-frontend.git
cd turfbook-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and add the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal, usually:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server after a successful build.

```bash
npm run lint
```

Runs ESLint checks.

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL used by the Axios client | `http://localhost:5000/api` |

## Internationalization

Translations are stored in:

- `locales/en.json`
- `locales/bn.json`

The i18n configuration is located at `lib/i18n.ts`.

## Payment Support

Stripe packages are included in the project dependencies, making the frontend ready for Stripe payment UI integration. Backend webhook handling, payment verification, and idempotency logic should be handled by the backend service.

## Contributing

Contributions are welcome. Please open an issue for bugs, suggestions, or feature requests, or submit a pull request with a clear description of the change.

## License

This project is private unless a license is added by the project owner.
