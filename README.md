# Video Sharing App Frontend

This is the frontend for the Video Sharing App, built with **React**, **Vite**, **Redux Toolkit**, and **Tailwind CSS**.

## Features
- Modern React (v18+) with functional components
- State management with Redux Toolkit
- Routing with React Router v6+
- Tailwind CSS for utility-first styling
- ESLint for code quality
- Chart.js integration for data visualization
- Google reCAPTCHA v3 support

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (if applicable).

### Development

Start the development server (default: [http://localhost:3001](http://localhost:3001)):
```bash
npm run dev
```

### Build

To build for production:
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure
```
front/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and static files
│   ├── components/   # Reusable React components
│   ├── helpers/      # Utility/helper functions
│   ├── layouts/      # Layout components
│   ├── pages/        # Route-based pages
│   ├── providers/    # Context providers
│   ├── redux/        # Redux store and slices
│   ├── services/     # API and service logic
│   ├── styles/       # Tailwind and custom CSS
│   ├── App.jsx       # Main App component
│   ├── main.jsx      # Entry point
│   └── Routes.jsx    # Route definitions
├── index.html        # HTML entry point
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Customization
- **Port:** Change the dev server port in `vite.config.js` (`port: 3001` by default).
- **Tailwind:** Customize Tailwind in `tailwind.config.js` and `src/styles/`.

## License
This project is for educational/demo purposes. Add your license here.


