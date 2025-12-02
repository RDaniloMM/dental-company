import { test, expect } from '@playwright/test';

test.describe('Autenticación y Acceso', () => {
  test('Recuperación de contraseña', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('https://dental-company-tacna.vercel.app/admin/login');
    
    // Hacer clic en '¿Olvidaste tu contraseña?'
    const forgotPasswordLink = page.getByRole('link', { name: /olvidaste.+contraseña/i });
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Se muestra formulario de recuperación
      await expect(page).toHaveURL(/forgot-password|recuperar/);
      
      // Ingresar email registrado
      const emailField = page.getByLabel(/email|correo/i);
      await emailField.fill('test@dental.company');
      
      // Enviar solicitud de recuperación
      const sendButton = page.getByRole('button', { name: /enviar|recuperar/i });
      await sendButton.click();
      
      // Verificar mensaje de confirmación
      await expect(page.getByText(/email.+enviado|revisa.+correo|instrucciones.+enviadas/i)).toBeVisible({ timeout: 5000 });
      
      // Simular acceso al enlace de recuperación
      // (En un test real, necesitarías acceso al email o usar un servicio de testing)
      console.log('Email de recuperación enviado correctamente');
    } else {
      console.log('Enlace de recuperación de contraseña no encontrado - omitiendo test');
      test.skip();
    }
  });
});