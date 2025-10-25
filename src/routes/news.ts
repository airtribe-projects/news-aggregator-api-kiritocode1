import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';
import { validateQuery, newsQuerySchema, headlinesQuerySchema } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/everything', validateQuery(newsQuerySchema), NewsController.getEverything);
router.get('/headlines', validateQuery(headlinesQuerySchema), NewsController.getTopHeadlines);
router.get('/sources', NewsController.getSources);

// Protected routes
router.get('/personalized', authenticateToken, NewsController.getPersonalizedNews);
router.put('/preferences', authenticateToken, NewsController.updatePreferences);

export default router;
