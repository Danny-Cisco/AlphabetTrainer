import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for tracking user progress or high scores could be added here
  // For this MVP, we don't need any backend APIs since all functionality
  // is handled in the frontend

  // Basic health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TypeTone API is running' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
