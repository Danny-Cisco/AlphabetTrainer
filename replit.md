# TypeTone - Alphabet Typing Practice

## Overview

TypeTone is a web-based typing practice application that focuses on alphabet sequences with audio feedback and metronome timing. The app uses sound cues including speech synthesis, key press sounds, and stereo panning to help users develop muscle memory and improve their typing skills. It supports various character sets (letters, numbers, punctuation) and includes customizable audio features for enhanced learning.

## Recent Changes (August 2025)

- **Enhanced Attempt Tracking System**: Complete overhaul with visual progress bars, timing data, and comprehensive history
- **Space-to-Start Functionality**: Prevents accidental restarts and ensures accurate timing measurements
- **Characters Per Second (CPS) Display**: Shows typing speed in intuitive CPS format with 2 decimal precision
- **Restart-on-Fail Mode Improvements**: Default mode with complete attempt tracking and confetti celebrations
- **Perfect Alignment System**: All attempt history items display consistently with progress/total format and aligned columns
- **Dual Confetti Triggers**: Celebrations work in both normal and restart-on-fail modes for completed sequences

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Router**: Lightweight client-side routing for single-page application navigation
- **Shadcn/ui Components**: Pre-built UI component library with Radix UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and dark/light theme support

### State Management
- **React Hooks**: Local component state using useState and useEffect
- **Custom Hooks**: Specialized hooks for typing logic (`use-typing`), audio management (`use-audio`), and theme switching (`use-theme`)
- **TanStack Query**: Server state management and caching (minimal backend interaction currently)

### Audio System
- **Web Audio API**: Native browser audio context for generating sounds
- **Speech Synthesis API**: Text-to-speech for letter pronunciation
- **Custom Audio Service**: Handles metronome sounds, key press feedback, and stereo panning effects
- **Configurable Audio Features**: 
  - Adjustable pitch levels for different keyboard rows
  - Volume controls and audio on/off toggles
  - Extreme panning options for left/right ear audio separation

### Backend Architecture
- **Express.js Server**: Minimal REST API server with middleware for logging and error handling
- **Development Setup**: Vite integration for hot module replacement in development
- **Static File Serving**: Production build serving with fallback to index.html for SPA routing
- **Health Check Endpoint**: Basic API monitoring capability

### Data Storage
- **PostgreSQL with Drizzle ORM**: Database schema defined in shared directory for potential user data
- **Neon Database**: Cloud PostgreSQL provider for production deployment
- **In-Memory Storage**: Current implementation uses memory-based storage for user data
- **Session Management**: PostgreSQL session store configuration for user sessions

### Character Set Management
- **Flexible Sequence Generation**: Support for alphabetical, reverse alphabetical, and custom character sequences
- **Character Type Filtering**: Configurable inclusion of letters, numbers, common punctuation, and extended punctuation
- **Dynamic Sequence Updates**: Real-time regeneration of practice sequences based on user preferences

### Typing Interface Features
- **Progress Tracking**: Visual indicators for typing progress and accuracy
- **Challenge Modes**: Additional complexity with required intermediate key presses (space, delete, return)
- **Keyboard Event Handling**: Capture and process user input with audio feedback
- **Focus Management**: Maintain input focus for seamless typing experience

### Theme System
- **Multi-Theme Support**: Light, dark, and system preference themes
- **CSS Custom Properties**: Dynamic theme switching using CSS variables
- **Persistent Theme Storage**: Local storage integration for theme preference retention

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first styling with PostCSS processing
- **Lucide React**: Consistent icon library for interface elements
- **Canvas Confetti**: Visual celebration effects for achievements

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundling for production
- **TypeScript**: Type safety across frontend and backend code
- **Replit Integration**: Development environment plugins for cloud-based coding

### Audio and Interaction
- **Date-fns**: Date manipulation utilities for potential timing features
- **React Hook Form**: Form validation and management with Zod schema validation
- **Clsx and Class Variance Authority**: Dynamic CSS class composition

### Database and Backend
- **Neon Database Serverless**: PostgreSQL database hosting
- **Connect PG Simple**: PostgreSQL session store for Express
- **Express Session**: User session management middleware

### Build and Runtime
- **Vite**: Modern build tool with React plugin support
- **Node.js**: Server runtime environment
- **NPM**: Package management and dependency resolution