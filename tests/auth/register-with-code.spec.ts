import { test, expect } from "@playwright/test";

/**
 * Test basado en Diagrama de Secuencia 3.3 - Registro con Código de Invitación
 * Flujo: Usuario → Frontend (código) → API (verificar código válido) → Frontend (formulario)
 *        → Supabase Auth (crear cuenta) → API (crear perfil personal + actualizar código) → Login
 */
test.describe("Autenticación - Diagrama 3.3 Registro con Invitación", () => {
  test("Registro de nuevo usuario con código de invitación", async ({
    page,
  }) => {
    // == Verificación del Código ==

    // 1. Usuario accede a página de registro
    await page.goto("https://dental-company-tacna.vercel.app/admin/sign-up");

    // 2. Frontend muestra campo de código de invitación
    const codeField = page.getByLabel(/código.+invitación/i);

    if (await codeField.isVisible()) {
      // 3. Usuario ingresa código de invitación
      await codeField.fill("TEST_CODE_123");

      // 4. Frontend envía a API para verificar código válido y con usos disponibles
      const verifyButton = page.getByRole("button", {
        name: /verificar.+código/i,
      });
      if (await verifyButton.isVisible()) {
        await verifyButton.click();

        // 5. API busca código en DB → Retorna resultado
        // Si código válido: Frontend muestra rol asignado y habilita formulario
        const codeAccepted = page.getByText(
          /código.+aceptado|código.+verificado|rol.+asignado/i
        );
        const codeError = page.getByText(
          /código.+inválido|código.+expirado|error/i
        );

        // Esperar por cualquiera de las dos respuestas
        await Promise.race([
          expect(codeAccepted).toBeVisible({ timeout: 5000 }),
          expect(codeError).toBeVisible({ timeout: 5000 }),
        ]).catch(() => {});
      }
    }

    // == Registro de Credenciales ==

    // 6. Frontend muestra formulario de usuario y contraseña
    const uniqueId = Date.now();
    const usernameField = page.getByLabel(/usuario|email/i).first();
    await usernameField.fill(`usuario_test_${uniqueId}@test.com`);

    const passwordField = page.getByLabel(/^contraseña$/i);
    await passwordField.fill("Password123!");

    const repeatPasswordField = page.getByLabel(
      /repetir.+contraseña|confirmar/i
    );
    if (await repeatPasswordField.isVisible()) {
      await repeatPasswordField.fill("Password123!");
    }

    // 7. Usuario envía formulario → Frontend solicita crear cuenta a Supabase Auth
    const registerButton = page.getByRole("button", {
      name: /registrar|crear.+cuenta/i,
    });
    await registerButton.click();

    // 8. Auth registra nuevo usuario en DB → Retorna usuario creado
    // 9. Frontend solicita a API completar registro (crear perfil personal con rol)
    // 10. API actualiza uso del código de invitación
    await page.waitForLoadState("networkidle");

    // 11. Frontend redirige a login o muestra mensaje de éxito
    const successIndicator = page.getByText(
      /registro.+exitoso|cuenta.+creada|bienvenido|verifica.+email/i
    );
    await expect(successIndicator).toBeVisible({ timeout: 10000 });
  });
});
