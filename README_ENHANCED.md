# REI Voice Pro - Enhanced Edition

A sophisticated AI-powered voice agent for real estate investors, specializing in seller negotiations, lead capture, and creative offer structuring using Google's Gemini Multimodal Live API.

## 🚀 Features

### Core Functionality
- **Voice-Based Negotiations**: Real-time voice conversations with AI-powered negotiation strategies
- **Automated Lead Capture**: Intelligent extraction of property address, contact info, and motivation
- **Creative Offer Structuring**: Three strategic offer types (Cash, Seller Finance, Lease Option)
- **ARV Estimation**: Automated After Repair Value calculation with comparable property search
- **Email Generation**: Personalized offer emails sent directly to sellers

### Enhanced Features (New)
- **Data Persistence**: LocalStorage integration for leads and offers
- **Export/Import**: Download and upload data in JSON format
- **Search & Filter**: Quick search across all lead fields
- **Toast Notifications**: User-friendly success/error messages
- **Error Boundaries**: Graceful error handling with recovery options
- **Loading States**: Visual feedback for async operations
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Gemini API Key** - Get yours from [Google AI Studio](https://aistudio.google.com/apikey)

## 🛠️ Installation

### 1. Clone or Extract the Project

```bash
cd rei-voice-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create or edit `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Replace `your_actual_api_key_here` with your real Gemini API key.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage Guide

### Starting a Conversation

1. Click the microphone button at the bottom of the screen
2. Allow microphone permissions when prompted
3. The AI will greet you automatically with "Hello, how can I help you?"
4. Begin your conversation naturally

### Data Collection Sequence

The AI follows a strict sequence:

1. **Property Address** - Captured and confirmed first
2. **Contact Information** - Name, email, and phone number
3. **Motivation** - Why the seller wants to sell

### Offer Strategies

The AI automatically selects the best strategy based on:

- **Cash Offer**: For motivated sellers with distressed properties
- **Seller Finance**: For sellers wanting higher price with flexible terms
- **Lease Option**: For properties with low/negative equity

### Managing Leads

- Click the **Users** icon (bottom left) to view all captured leads
- Use the search bar to filter leads
- Click any lead to view full details
- Export leads as JSON for backup or CRM integration

### Managing Offers

- Click the **File** icon to view structured offers
- Review offer details including ARV, purchase price, and terms
- Send offers via email directly from the interface

### Data Management

Access data management from the header:

- **Export**: Download all leads and offers as JSON
- **Import**: Upload previously exported data
- **Clear**: Remove all stored data (with confirmation)

## 🏗️ Project Structure

```
rei-voice-pro/
├── src/
│   ├── components/          # React components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ExportImport.tsx
│   │   ├── EnhancedLeadPanel.tsx
│   │   ├── Visualizer.tsx
│   │   ├── TranscriptPanel.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── LeadPanel.tsx
│   │   ├── OfferPanel.tsx
│   │   └── EmailModal.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useMultimodalLive.ts
│   │   └── useToast.ts
│   ├── utils/               # Utility functions
│   │   ├── audioUtils.ts
│   │   ├── toolDefinitions.ts
│   │   ├── storage.ts
│   │   └── envValidation.ts
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles with Tailwind
│   └── types.ts             # TypeScript type definitions
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── .env.local               # Environment variables (not in git)
└── .gitignore               # Git ignore rules
```

## 🔧 Configuration

### Voice Personas

Choose from 5 different voice personas in Settings:

- **Puck** (Default)
- **Charon**
- **Kore**
- **Fenrir**
- **Zephyr**

### System Instructions

Customize the AI's behavior by editing the system prompt in Settings. The default prompt includes:

- Greeting protocol
- Data collection sequence
- ARV estimation logic
- Offer structuring formulas
- Objection handling strategies

## 📊 Offer Calculation Formulas

### Cash Offer
```
Base = ARV × 0.70
Return Bump = Base × 0.15
Final Price = (Base + Return Bump) - Repairs
```

### Lease Option
```
Base = ARV × 0.85
Return = Base × 0.15
Final Price = Base + Return
```

### Seller Finance
```
Purchase Price = (ARV + 50,000) × 0.92
Down Payment = Purchase Price × 0.10
Monthly Payment = P&I + $341.67 (taxes + insurance)
Balloon = 60 months (5 years)
```

## 🐛 Troubleshooting

### Microphone Not Working

1. Check browser permissions (usually top-left of address bar)
2. Ensure you're using HTTPS or localhost
3. Try a different browser (Chrome/Edge recommended)

### API Key Error

```
Error: Gemini API key is not configured
```

**Solution**: Set `VITE_GEMINI_API_KEY` in `.env.local` with a valid API key

### Audio Not Playing

1. Check system volume and browser audio settings
2. Click anywhere on the page to resume audio context
3. Refresh the page and try again

### Data Not Persisting

1. Check browser localStorage is enabled
2. Ensure you're not in incognito/private mode
3. Check browser storage quota

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

#### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option 3: Static Hosting

Upload the `dist/` folder to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

### Environment Variables in Production

Remember to set `VITE_GEMINI_API_KEY` in your hosting platform's environment variables.

## 🔒 Security Considerations

- **API Keys**: Never commit `.env.local` to version control
- **CORS**: Configure CORS properly for production domains
- **Rate Limiting**: Implement rate limiting for API calls
- **Input Validation**: All user inputs are sanitized before processing

## 📈 Performance Optimization

- **Code Splitting**: Vite automatically splits code for optimal loading
- **Lazy Loading**: Components are loaded on demand
- **Audio Optimization**: Audio is processed in chunks to minimize latency
- **State Management**: Efficient React state management with hooks

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Add JSDoc comments for complex functions

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues, questions, or feature requests:

1. Check the troubleshooting section above
2. Review the [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
3. Contact the development team

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Gemini API](https://ai.google.dev/gemini-api/docs)

## 🔄 Changelog

### Version 2.0.0 (Enhanced Edition)

- ✅ Added Tailwind CSS configuration
- ✅ Implemented data persistence with localStorage
- ✅ Created toast notification system
- ✅ Added error boundary for graceful error handling
- ✅ Implemented export/import functionality
- ✅ Enhanced lead panel with search and filter
- ✅ Fixed environment variable handling
- ✅ Improved mobile responsiveness
- ✅ Added loading states and spinners
- ✅ Created comprehensive documentation

### Version 1.0.0 (Original)

- Initial release with core voice agent functionality
- Lead capture and offer structuring
- Email generation
- Basic UI components

## 🎯 Roadmap

### Upcoming Features

- [ ] Multi-user authentication
- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] SMS notifications (Twilio)
- [ ] Analytics dashboard
- [ ] Call recording and playback
- [ ] Dark/Light mode toggle
- [ ] Keyboard shortcuts
- [ ] PWA support for mobile installation
- [ ] Multi-language support

---

**Built with ❤️ for Real Estate Investors**
