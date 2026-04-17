import { describe, it, expect, beforeEach } from 'vitest';

// Mock analytics engine
const createAnalyticsEngine = () => {
  return {
    // Lead scoring (0-10)
    scoreLead(leadData) {
      let score = 5.0; // Base score
      
      // Email quality boost
      if (leadData.email && leadData.email.includes('@')) {
        score += 1.5;
      }
      
      // Phone validity boost
      if (leadData.phone && leadData.phone.length >= 10) {
        score += 1.5;
      }
      
      // Intent strength boost
      if (leadData.intent === 'service_inquiry') {
        score += 1.0;
      }
      
      return Math.min(score, 10.0);
    },
    
    // Intent detection from keywords
    detectIntent(keywords) {
      const intents = {
        'service_inquiry': ['service', 'help', 'assist'],
        'consultation': ['consult', 'advice', 'guidance'],
        'pricing': ['cost', 'price', 'rate'],
      };
      
      for (const [intent, words] of Object.entries(intents)) {
        if (words.some(w => keywords.toLowerCase().includes(w))) {
          return intent;
        }
      }
      
      return 'general';
    },
    
    // Buying stage determination
    determineBuyingStage(engagementScore, timeSpent) {
      if (engagementScore > 8) return 'decision';
      if (engagementScore > 5 && timeSpent > 300) return 'consideration';
      return 'awareness';
    },
  };
};

describe('Analytics Engine', () => {
  let analytics;
  
  beforeEach(() => {
    analytics = createAnalyticsEngine();
  });
  
  describe('Lead Scoring', () => {
    it('should calculate base score of 5', () => {
      const leadData = { name: 'John' };
      const score = analytics.scoreLead(leadData);
      
      expect(score).toBe(5.0);
    });
    
    it('should boost score for valid email', () => {
      const leadData = { email: 'john@example.com' };
      const score = analytics.scoreLead(leadData);
      
      expect(score).toBeGreaterThan(5.0);
      expect(score).toBe(6.5);
    });
    
    it('should boost score for valid phone', () => {
      const leadData = { phone: '+1234567890' };
      const score = analytics.scoreLead(leadData);
      
      expect(score).toBeGreaterThan(5.0);
      expect(score).toBe(6.5);
    });
    
    it('should calculate composite score', () => {
      const leadData = {
        email: 'john@example.com',
        phone: '+1234567890',
        intent: 'service_inquiry',
      };
      const score = analytics.scoreLead(leadData);
      
      expect(score).toBeGreaterThan(8.0);
      expect(score).toBeLessThanOrEqual(10.0);
    });
    
    it('should cap score at 10', () => {
      const leadData = {
        email: 'john@example.com',
        phone: '+1234567890',
        intent: 'service_inquiry',
        business: 'Acme Corp',
      };
      const score = analytics.scoreLead(leadData);
      
      expect(score).toBeLessThanOrEqual(10.0);
    });
  });
  
  describe('Intent Detection', () => {
    it('should detect service inquiry intent', () => {
      const intent = analytics.detectIntent('I need help with a service');
      expect(intent).toBe('service_inquiry');
    });
    
    it('should detect consultation intent', () => {
      const intent = analytics.detectIntent('I need consultation');
      expect(intent).toBe('consultation');
    });
    
    it('should detect pricing intent', () => {
      const intent = analytics.detectIntent('What is your price?');
      expect(intent).toBe('pricing');
    });
    
    it('should default to general intent', () => {
      const intent = analytics.detectIntent('Hello world');
      expect(intent).toBe('general');
    });
    
    it('should be case insensitive', () => {
      const intent = analytics.detectIntent('SERVICE INQUIRY');
      expect(intent).toBe('service_inquiry');
    });
  });
  
  describe('Buying Stage Determination', () => {
    it('should detect awareness stage', () => {
      const stage = analytics.determineBuyingStage(3, 60);
      expect(stage).toBe('awareness');
    });
    
    it('should detect consideration stage', () => {
      const stage = analytics.determineBuyingStage(6, 400);
      expect(stage).toBe('consideration');
    });
    
    it('should detect decision stage', () => {
      const stage = analytics.determineBuyingStage(9, 600);
      expect(stage).toBe('decision');
    });
    
    it('should prioritize high engagement', () => {
      const stage = analytics.determineBuyingStage(9, 60);
      expect(stage).toBe('decision');
    });
  });
});
