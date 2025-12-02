import { test, expect } from '@playwright/test';

test.describe('Dashboard y KPIs', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('https://dental-company-tacna.vercel.app/admin/login');
    await page.getByLabel(/usuario/i).fill('admin');
    await page.getByLabel(/contraseña/i).fill('admin123');
    await page.getByRole('button', { name: /iniciar.+sesión/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test('Responsividad del dashboard', async ({ page }) => {
    // Acceder al dashboard en escritorio (por defecto)
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    
    // Verificar layout de escritorio
    const desktopCards = page.locator('.grid, [class*="grid-cols"], [class*="flex"]');
    await expect(desktopCards.first()).toBeVisible();
    
    // Cambiar tamaño de ventana a tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Esperar a que se adapte el CSS
    
    // Verificar adaptación de tarjetas KPI
    const tabletLayout = page.locator('.card, [data-testid*="kpi"]');
    await expect(tabletLayout.first()).toBeVisible();
    
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Comprobar legibilidad de gráficos
    const mobileCharts = page.locator('[class*="chart"], svg, canvas');
    if (await mobileCharts.count() > 0) {
      await expect(mobileCharts.first()).toBeVisible();
    }
    
    // Verificar menú de navegación móvil
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .hamburger, [aria-label*="menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // El menú hamburguesa funciona en móvil
      const mobileMenu = page.locator('[role="navigation"], .mobile-nav, .sidebar');
      await expect(mobileMenu).toBeVisible();
      
      // Verificar que no hay desbordamiento horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = 375;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px de margen de error
      
      // Todos los elementos son accesibles
      const navigationLinks = page.locator('a[href*="/admin"], [role="menuitem"]');
      if (await navigationLinks.count() > 0) {
        await expect(navigationLinks.first()).toBeVisible();
      }
      
      // Cerrar menú móvil
      await mobileMenuButton.click();
    }
    
    // Restaurar vista de escritorio
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});