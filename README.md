# REI Voice Pro - Enhanced Edition

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A sophisticated AI-powered voice agent for real estate investors, specializing in seller negotiations, lead capture, and creative offer structuring using Google's Gemini Multimodal Live API.

This enhanced edition includes critical bug fixes, performance optimizations, and significant feature upgrades to make the application production-ready.

---

## 🚀 Features

| Category | Feature | Description |
| :--- | :--- | :--- |
| **Core** | Voice-Based Negotiations | Real-time voice conversations with AI-powered negotiation strategies. |
| | Automated Lead Capture | Intelligent extraction of property address, contact info, and motivation. |
| | Creative Offer Structuring | Three strategic offer types: Cash, Seller Finance, and Lease Option. |
| | ARV Estimation | Automated After Repair Value calculation with comparable property search. |
| | Email Generation | Personalized offer emails sent directly to sellers. |
| **Enhanced** | Data Persistence | Leads and offers are saved to localStorage to prevent data loss. |
| | Export/Import Data | Download and upload all application data as a single JSON file. |
| | Search & Filter Leads | Quickly search across all lead fields for easy access. |
| | Toast Notifications | User-friendly success, error, and warning messages. |
| | Error Boundaries | Graceful error handling with recovery options to prevent crashes. |
| | Loading States | Visual feedback for asynchronous operations. |
| | Mobile Responsive | Fully optimized for desktop, tablet, and mobile devices. |

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Gemini API Key** - Get yours from [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🛠️ Installation

### 1. Install Dependencies

Navigate to the project directory and install the required `npm` packages.

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root and add your Gemini API key.

```env
# Get your API key from https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Replace `your_actual_api_key_here` with your real Gemini API key. The application will not work without it.

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` by default.

---

## 🎯 Usage Guide

### Starting a Conversation

1.  Click the **microphone button** at the bottom of the screen.
2.  Allow microphone permissions when prompted by your browser.
3.  The AI will greet you automatically with "Hello, how can I help you?"
4.  Begin your conversation naturally.

### Data Management

Use the new data management tools in the header to:

-   **Export**: Download all leads and offers as a JSON file.
-   **Import**: Upload a previously exported JSON file to restore data.
-   **Clear**: Permanently delete all stored leads and offers (confirmation required).

---

## 🏗️ Project Structure

The project follows a standard Vite + React + TypeScript structure, with enhancements for scalability and maintainability.

```
rei-voice-pro/
├── src/
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles with Tailwind
│   └── types.ts             # TypeScript type definitions
├── .env.local               # Environment variables (not in git)
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This command creates an optimized, production-ready build in the `dist/` directory.

### Deployment Platforms

The `dist/` folder can be deployed to any static hosting service. Recommended platforms include:

-   **Vercel**: `vercel`
-   **Netlify**: `netlify deploy --prod`
-   **Cloudflare Pages**
-   **AWS S3 + CloudFront**

Remember to set the `VITE_GEMINI_API_KEY` environment variable in your hosting platform's settings.

---

## 🔄 Changelog

### Version 2.0.0 (Enhanced Edition)

-   **Added**: Tailwind CSS configuration for proper styling.
-   **Added**: Data persistence with localStorage for leads and offers.
-   **Added**: Toast notification system for user feedback.
-   **Added**: Error boundary to prevent application crashes.
-   **Added**: Export/Import functionality for data management.
-   **Added**: Enhanced lead panel with search and filter capabilities.
-   **Fixed**: Environment variable handling and validation.
-   **Fixed**: Mobile responsiveness and cross-device compatibility.
-   **Added**: Loading states and spinners for async operations.
-   **Added**: Comprehensive project documentation.

### Version 1.0.0 (Original)

-   Initial release with core voice agent functionality.

---

**Built with ❤️ for Real Estate Investors**
