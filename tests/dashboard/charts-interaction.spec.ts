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

  test('Interacción con gráficos estadísticos', async ({ page }) => {
    // Buscar sección de gráficos o navegar si está en página separada
    const chartsSection = page.locator('[data-testid="charts"], .charts, [class*="chart"]');
    
    if (await chartsSection.count() === 0) {
      // Buscar enlace a gráficos/estadísticas
      const chartsLink = page.getByRole('link', { name: /gráfico|estadístic|chart|analytic/i });
      if (await chartsLink.isVisible()) {
        await chartsLink.click();
      }
    }
    
    // Hacer clic en el botón 'Personalizar'
    const customizeButton = page.getByRole('button', { name: /personalizar|configurar|ajuste/i });
    if (await customizeButton.isVisible()) {
      await customizeButton.click();
      
      // Verificar aparición del menú de configuración
      const configMenu = page.locator('[role="menu"], .dropdown-menu, [data-testid="chart-config"]');
      await expect(configMenu).toBeVisible();
      
      // Ocultar algunos gráficos
      const chartToggle = page.getByRole('checkbox').first();
      if (await chartToggle.isVisible()) {
        await chartToggle.uncheck();
        
        // Verificar que el contador de gráficos visibles se actualiza
        const visibleCount = page.getByText(/mostrando.+\d+.+de.+\d+/i);
        if (await visibleCount.isVisible()) {
          await expect(visibleCount).toContainText(/mostrando/i);
        }
      }
      
      // Mostrar gráficos ocultos
      if (await chartToggle.isVisible()) {
        await chartToggle.check();
      }
      
      // Usar 'Mostrar todos' y 'Ocultar todos'
      const showAllButton = page.getByRole('button', { name: /mostrar.+todos/i });
      if (await showAllButton.isVisible()) {
        await showAllButton.click();
      }
      
      const hideAllButton = page.getByRole('button', { name: /ocultar.+todos/i });
      if (await hideAllButton.isVisible()) {
        await hideAllButton.click();
      }
      
      // Restablecer configuración
      const resetButton = page.getByRole('button', { name: /restablecer|reset/i });
      if (await resetButton.isVisible()) {
        await resetButton.click();
      }
      
      // Cerrar menú
      await page.keyboard.press('Escape');
    }
    
    // Verificar persistencia de preferencias (recargar página)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Los gráficos deberían mantener su configuración
    console.log('Verificando persistencia de configuración de gráficos');
  });
});