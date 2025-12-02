import { test, expect } from "@playwright/test";

/**
 * Test basado en Diagrama de Secuencia 3.4 - Inicio de Sesión (rama de error)
 * Flujo: Usuario → Frontend → Auth → DB (credenciales inválidas) → Error → Permanece en login
 */
test.describe("Autenticación - Diagrama 3.4 (Error)", () => {
  test("Login fallido con credenciales inválidas", async ({ page }) => {
    // 1. Usuario accede a página de login
    await page.goto("https://dental-company-tacna.vercel.app/admin/login");
    await expect(page).toHaveURL(/\/admin\/login/);

    // 2. Frontend muestra formulario
    const usernameField = page.getByLabel(/usuario/i);
    const passwordField = page.getByLabel(/contraseña/i);

    // 3. Usuario ingresa credenciales incorrectas
    await usernameField.fill("usuario_invalido");
    await passwordField.fill("contraseña_incorrecta");

    // 4. Frontend solicita autenticación
    const loginButton = page.getByRole("button", { name: /iniciar.+sesión/i });
    await loginButton.click();

    // 5. Auth verifica con DB → Credenciales incorrectas
    // 6. Auth retorna error "Credenciales inválidas" al Frontend
    await expect(
      page.getByText(
        /usuario.+o.+contraseña.+incorrectos|credenciales.+inválid/i
      )
    ).toBeVisible({ timeout: 5000 });

    // 7. Frontend muestra mensaje de error, usuario permanece en login
    await expect(page).toHaveURL(/\/admin\/login/);

    // Los campos se mantienen visibles para reintento
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
