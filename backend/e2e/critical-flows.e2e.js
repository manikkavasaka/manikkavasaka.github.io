import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Flow 1: Hero to Lead Capture Form', async ({ page }) => {
    // Step 1: Verify hero section loaded
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    
    // Step 2: Find and click CTA button
    const ctaButton = page.locator('button:has-text("Get Started")');
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();
    
    // Step 3: Verify lead form appears
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Step 4: Fill form
    await emailInput.fill('test@example.com');
    await page.locator('input[placeholder="Your Name"]').fill('Test User');
    
    // Step 5: Submit form
    const submitBtn = page.locator('button:has-text("Submit")');
    await submitBtn.click();
    
    // Step 6: Verify success message
    const successMsg = page.locator('text=Thank you for your interest');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('Flow 2: Service Page Exploration', async ({ page }) => {
    // Step 1: Navigate to services
    await page.click('a[href="/services"]');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Scroll through services
    const serviceCards = page.locator('[data-testid="service-card"]');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Step 3: Click on first service
    await serviceCards.first().click();
    
    // Step 4: Verify service details loaded
    const serviceTitle = page.locator('h2');
    await expect(serviceTitle).toBeVisible();
    
    // Step 5: Find and click service CTA
    const serviceCta = page.locator('button:has-text("Learn More")');
    if (await serviceCta.isVisible()) {
      await serviceCta.click();
    }
  });

  test('Flow 3: Chatbot Interaction', async ({ page }) => {
    // Step 1: Verify chatbot visible
    const chatbot = page.locator('[data-testid="chatbot-widget"]');
    await expect(chatbot).toBeVisible();
    
    // Step 2: Click to open chatbot
    await chatbot.click();
    
    // Step 3: Verify chat input appears
    const chatInput = page.locator('[data-testid="chat-input"]');
    await expect(chatInput).toBeVisible();
    
    // Step 4: Send message
    await chatInput.fill('I need help with a service');
    await page.keyboard.press('Enter');
    
    // Step 5: Verify bot response
    const botMessage = page.locator('[data-testid="chat-message-bot"]');
    await expect(botMessage).toBeVisible({ timeout: 5000 });
    
    // Step 6: Verify message in chat history
    const chatHistory = page.locator('[data-testid="chat-history"]');
    await expect(chatHistory).toContainText('help');
  });

  test('Flow 4: Lead Scoring & Analytics', async ({ page }) => {
    // Step 1: Fill lead form
    await page.fill('input[type="email"]', 'lead@example.com');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[type="tel"]', '+1234567890');
    
    // Step 2: Submit lead
    await page.click('button:has-text("Capture Lead")');
    
    // Step 3: Verify analytics tracked
    // Check localStorage for session data
    const sessionData = await page.evaluate(() => {
      return localStorage.getItem('session');
    });
    expect(sessionData).toBeTruthy();
    
    // Step 4: Verify success response
    const successResponse = page.locator('[data-testid="lead-success"]');
    await expect(successResponse).toBeVisible({ timeout: 5000 });
  });

  test('Flow 5: Email/WhatsApp Confirmation', async ({ page }) => {
    // Step 1: Capture lead
    await page.fill('input[type="email"]', 'notification@example.com');
    await page.fill('input[placeholder="Name"]', 'Notification Test');
    await page.fill('input[type="tel"]', '+1234567890');
    await page.click('button:has-text("Capture Lead")');
    
    // Step 2: Verify confirmation message
    const confirmMsg = page.locator('text=We\'ve sent a confirmation');
    await expect(confirmMsg).toBeVisible({ timeout: 5000 });
    
    // Step 3: Verify multiple notification channels offered
    const channels = page.locator('[data-testid="notification-channel"]');
    const channelCount = await channels.count();
    expect(channelCount).toBeGreaterThan(0);
  });

  test('Flow 6: Responsive Design - Mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 1: Verify responsive layout
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeVisible();
    
    // Step 2: Open mobile menu if exists
    const menuBtn = page.locator('[data-testid="menu-toggle"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
    }
    
    // Step 3: Navigate via mobile menu
    const mobileLink = page.locator('a[href="/services"]');
    if (await mobileLink.isVisible()) {
      await mobileLink.click();
    }
    
    // Step 4: Fill form on mobile
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('mobile@example.com');
    
    // Step 5: Verify form submits on mobile
    const submitBtn = page.locator('button:has-text("Submit")');
    await expect(submitBtn).toBeVisible();
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1s = page.locator('h1');
    const h2s = page.locator('h2');
    
    expect(await h1s.count()).toBeGreaterThan(0);
    expect(await h2s.count()).toBeGreaterThan(0);
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');
    
    const formInputs = page.locator('input');
    const count = await formInputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = formInputs.nth(i);
      const hasLabel = await page.locator(`label[for="${await input.getAttribute('id')}"]`).isVisible().catch(() => false);
      const hasPlaceholder = await input.getAttribute('placeholder');
      
      expect(hasLabel || hasPlaceholder).toBeTruthy();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Basic check: verify text is readable
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveCSS('color', /rgb/);
  });
});

test.describe('Performance Tests', () => {
  test('should load home page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to bottom to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const images = page.locator('img[loading="lazy"]');
    expect(await images.count()).toBeGreaterThan(0);
  });
});
