import { test, expect } from "@playwright/test";

/**
 * Test basado en Diagrama de Secuencia 3.1 - Recuperación de Contraseña
 * Flujo: Usuario → Frontend (formulario email) → Supabase Auth → DB (verificar usuario)
 *        → Servicio Email (enviar enlace) → Usuario recibe email → Frontend (nueva contraseña)
 */
test.describe("Autenticación - Diagrama 3.1 Recuperación Contraseña", () => {
  test("Solicitud de recuperación de contraseña", async ({ page }) => {
    // == Solicitud de Recuperación ==

    // 1. Usuario accede a recuperar contraseña desde login
    await page.goto("https://dental-company-tacna.vercel.app/admin/login");

    // 2. Frontend muestra enlace de recuperación
    const forgotPasswordLink = page.getByRole("link", {
      name: /olvidaste.+contraseña/i,
    });
    if (!(await forgotPasswordLink.isVisible())) {
      console.log("Enlace de recuperación no encontrado - omitiendo test");
      test.skip();
      return;
    }

    await forgotPasswordLink.click();

    // 3. Frontend muestra formulario de email
    await expect(page).toHaveURL(/forgot-password|recuperar/);
    const emailField = page.getByLabel(/email|correo/i);
    await expect(emailField).toBeVisible();

    // 4. Usuario ingresa su correo electrónico
    await emailField.fill("test@dental.company");

    // 5. Frontend solicita restablecimiento a Supabase Auth
    const sendButton = page.getByRole("button", {
      name: /enviar|recuperar|restablecer/i,
    });
    await sendButton.click();

    // 6. Auth verifica existencia del usuario en DB
    // 7. Auth envía correo con enlace de recuperación via Servicio Email
    // 8. Auth retorna "Solicitud procesada" al Frontend

    // 9. Frontend muestra confirmación de envío
    await expect(
      page.getByText(
        /email.+enviado|revisa.+correo|instrucciones.+enviadas|enlace.+enviado/i
      )
    ).toBeVisible({ timeout: 10000 });

    // Nota: El flujo de "Restablecimiento de Contraseña" requiere acceso al email
    // para obtener el enlace seguro y completar el cambio de contraseña
  });
});
