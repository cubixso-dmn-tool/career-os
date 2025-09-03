import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { communityFeatureCards, users } from '../../shared/schema.js';
import { eq, and, desc, asc } from 'drizzle-orm';

const router = Router();

// Validation schemas
const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  imageUrl: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'Invalid image URL'
  }),
  redirectUrl: z.string().url('Invalid redirect URL'),
  category: z.enum(['communities', 'projects', 'events', 'competitions']),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

const updateCardSchema = createCardSchema.partial();

// Get all community feature cards (public endpoint for user dashboard)
router.get('/cards', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = db.select({
      id: communityFeatureCards.id,
      title: communityFeatureCards.title,
      description: communityFeatureCards.description,
      imageUrl: communityFeatureCards.imageUrl,
      redirectUrl: communityFeatureCards.redirectUrl,
      category: communityFeatureCards.category,
      displayOrder: communityFeatureCards.displayOrder,
      createdAt: communityFeatureCards.createdAt
    }).from(communityFeatureCards)
    .where(eq(communityFeatureCards.isActive, true));

    if (category) {
      query = query.where(
        and(
          eq(communityFeatureCards.isActive, true),
          eq(communityFeatureCards.category, category as string)
        )
      );
    }

    const cards = await query.orderBy(asc(communityFeatureCards.displayOrder), desc(communityFeatureCards.createdAt));
    
    res.json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching community feature cards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cards' });
  }
});

// Simple admin check middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  // For now, check if user ID is 1 (admin) - in production this should use proper RBAC
  if (req.user.id !== 1) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Admin endpoints (require admin role)
router.use('/admin', requireAdmin);

// Get all cards for admin management
router.get('/admin/cards', async (req, res) => {
  try {
    const cards = await db.select({
      id: communityFeatureCards.id,
      title: communityFeatureCards.title,
      description: communityFeatureCards.description,
      imageUrl: communityFeatureCards.imageUrl,
      redirectUrl: communityFeatureCards.redirectUrl,
      category: communityFeatureCards.category,
      displayOrder: communityFeatureCards.displayOrder,
      isActive: communityFeatureCards.isActive,
      createdAt: communityFeatureCards.createdAt,
      updatedAt: communityFeatureCards.updatedAt,
      createdBy: {
        id: users.id,
        name: users.name,
        username: users.username
      }
    }).from(communityFeatureCards)
    .leftJoin(users, eq(communityFeatureCards.createdBy, users.id))
    .orderBy(asc(communityFeatureCards.displayOrder), desc(communityFeatureCards.createdAt));
    
    res.json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching admin cards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cards' });
  }
});

// Create new community feature card
router.post('/admin/cards', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const validatedData = createCardSchema.parse(req.body);
    
    const [card] = await db.insert(communityFeatureCards)
      .values({
        ...validatedData,
        imageUrl: validatedData.imageUrl === '' ? null : validatedData.imageUrl,
        createdBy: req.user.id
      })
      .returning();
    
    res.json({ success: true, data: card });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error creating community feature card:', error);
    res.status(500).json({ success: false, error: 'Failed to create card' });
  }
});

// Update community feature card
router.put('/admin/cards/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const cardId = parseInt(req.params.id);
    const validatedData = updateCardSchema.parse(req.body);
    
    const [updatedCard] = await db.update(communityFeatureCards)
      .set({
        ...validatedData,
        imageUrl: validatedData.imageUrl === '' ? null : validatedData.imageUrl,
        updatedAt: new Date()
      })
      .where(eq(communityFeatureCards.id, cardId))
      .returning();
    
    if (!updatedCard) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    
    res.json({ success: true, data: updatedCard });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error updating community feature card:', error);
    res.status(500).json({ success: false, error: 'Failed to update card' });
  }
});

// Delete community feature card
router.delete('/admin/cards/:id', async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    
    const [deletedCard] = await db.delete(communityFeatureCards)
      .where(eq(communityFeatureCards.id, cardId))
      .returning();
    
    if (!deletedCard) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    
    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting community feature card:', error);
    res.status(500).json({ success: false, error: 'Failed to delete card' });
  }
});

// Toggle card active status
router.patch('/admin/cards/:id/toggle', async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    
    // Get current status
    const [currentCard] = await db.select({ isActive: communityFeatureCards.isActive })
      .from(communityFeatureCards)
      .where(eq(communityFeatureCards.id, cardId));
    
    if (!currentCard) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    
    // Toggle status
    const [updatedCard] = await db.update(communityFeatureCards)
      .set({ 
        isActive: !currentCard.isActive,
        updatedAt: new Date()
      })
      .where(eq(communityFeatureCards.id, cardId))
      .returning();
    
    res.json({ success: true, data: updatedCard });
  } catch (error) {
    console.error('Error toggling card status:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle card status' });
  }
});

export default router;