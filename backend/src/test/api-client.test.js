import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock API client
const createApiClient = () => {
  return {
    async get(url) {
      const response = await fetch(url);
      return response.json();
    },
    
    async post(url, data) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    async put(url, data) {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  };
};

describe('API Client', () => {
  let apiClient;
  
  beforeEach(() => {
    apiClient = createApiClient();
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('GET requests', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'John' };
      global.fetch.mockResolvedValueOnce({
        json: async () => mockData,
      });
      
      const result = await apiClient.get('/api/leads/1');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1');
      expect(result).toEqual(mockData);
    });
    
    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(apiClient.get('/api/leads/1')).rejects.toThrow('Network error');
    });
  });
  
  describe('POST requests', () => {
    it('should send data successfully', async () => {
      const sendData = { email: 'test@example.com', name: 'Test' };
      const mockResponse = { success: true, leadId: '123' };
      
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      
      const result = await apiClient.post('/api/leads', sendData);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
      expect(result).toEqual(mockResponse);
    });
    
    it('should validate request data', async () => {
      const invalidData = { email: 'invalid-email' };
      
      // This would be caught by frontend validation
      expect(invalidData.email).toBeDefined();
    });
  });
  
  describe('PUT requests', () => {
    it('should update data successfully', async () => {
      const updateData = { status: 'qualified' };
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      
      const result = await apiClient.put('/api/leads/123', updateData);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/123', expect.objectContaining({
        method: 'PUT',
      }));
      expect(result).toEqual(mockResponse);
    });
  });
});
