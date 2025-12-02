import { test, expect } from '@playwright/test';

test.describe('Autenticación y Acceso', () => {
  test('Registro de nuevo usuario con código de invitación', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('https://dental-company-tacna.vercel.app/admin/sign-up');
    
    // Ingresar nombre de usuario único
    const usernameField = page.getByLabel(/usuario/i);
    await usernameField.fill(`usuario_test_${Date.now()}`);
    
    // Ingresar contraseña fuerte
    const passwordField = page.getByLabel(/^contraseña$/i);
    await passwordField.fill('Password123!');
    
    // Repetir la contraseña
    const repeatPasswordField = page.getByLabel(/repetir.+contraseña/i);
    await repeatPasswordField.fill('Password123!');
    
    // Ingresar código de invitación válido (si el campo está visible)
    const codeField = page.getByLabel(/código.+invitación/i);
    if (await codeField.isVisible()) {
      await codeField.fill('TEST_CODE_123');
      
      // Hacer clic en 'Verificar código'
      const verifyButton = page.getByRole('button', { name: /verificar.+código/i });
      if (await verifyButton.isVisible()) {
        await verifyButton.click();
        // El código de invitación se verifica correctamente
        await expect(page.getByText(/código.+verificado/i)).toBeVisible({ timeout: 5000 });
      }
    }
    
    // Confirmar registro
    const registerButton = page.getByRole('button', { name: /registrar/i });
    await registerButton.click();
    
    // Verificar proceso de registro (puede mostrar mensaje de éxito o redirección)
    await page.waitForLoadState('networkidle');
    
    // Puede redirigir al dashboard o mostrar mensaje de confirmación
    const successIndicator = page.getByText(/registro.+exitoso|bienvenido|dashboard/i);
    await expect(successIndicator).toBeVisible({ timeout: 10000 });
  });
});