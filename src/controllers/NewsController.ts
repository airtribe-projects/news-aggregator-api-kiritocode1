import { Request, Response } from 'express';
import { NewsService } from '../services/NewsService';
import { User } from '../models/User';
import { NewsQueryParams, TopHeadlinesParams, ApiResponse } from '../types';

export class NewsController {
  static async getEverything(req: Request, res: Response): Promise<void> {
    try {
      const params: NewsQueryParams = req.query as any;
      
      const news = await NewsService.getEverything(params);
      
      res.json({
        success: true,
        data: news,
        message: 'News articles retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch news',
      } as ApiResponse);
    }
  }

  static async getTopHeadlines(req: Request, res: Response): Promise<void> {
    try {
      const params: TopHeadlinesParams = req.query as any;
      
      const news = await NewsService.getTopHeadlines(params);
      
      res.json({
        success: true,
        data: news,
        message: 'Top headlines retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch headlines',
      } as ApiResponse);
    }
  }

  static async getSources(req: Request, res: Response): Promise<void> {
    try {
      const sources = await NewsService.getSources();
      
      res.json({
        success: true,
        data: sources,
        message: 'News sources retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sources',
      } as ApiResponse);
    }
  }

  static async getPersonalizedNews(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      const { preferences } = user;
      const params: NewsQueryParams = {
        ...req.query,
        sources: preferences.sources.join(','),
        language: preferences.languages.join(','),
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (!params[key as keyof NewsQueryParams]) {
          delete params[key as keyof NewsQueryParams];
        }
      });

      const news = await NewsService.getEverything(params);
      
      res.json({
        success: true,
        data: news,
        message: 'Personalized news retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch personalized news',
      } as ApiResponse);
    }
  }

  static async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { preferences } = req.body;

      const updatedUser = await User.updatePreferences(userId, preferences);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: {
          preferences: updatedUser.preferences,
        },
        message: 'Preferences updated successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}
