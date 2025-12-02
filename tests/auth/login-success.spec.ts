import { test, expect } from "@playwright/test";

/**
 * Test basado en Diagrama de Secuencia 3.4 - Inicio de Sesión
 * Flujo: Usuario → Frontend (formulario) → Supabase Auth → DB (verificar) → Middleware → Dashboard
 */
test.describe("Autenticación - Diagrama 3.4", () => {
  test("Login exitoso con credenciales válidas", async ({ page }) => {
    // 1. Usuario accede a página de login
    await page.goto("https://dental-company-tacna.vercel.app/admin/login");

    // 2. Frontend muestra formulario
    await expect(page).toHaveURL(/\/admin\/login/);
    const usernameField = page.getByLabel(/usuario/i);
    const passwordField = page.getByLabel(/contraseña/i);
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();

    // 3. Usuario ingresa credenciales
    await usernameField.fill("admin");
    await passwordField.fill("admin123");

    // 4. Frontend solicita autenticación a Supabase Auth
    const loginButton = page.getByRole("button", { name: /iniciar.+sesión/i });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();

    // 5. Verificar estado de carga (Auth verifica credenciales con DB)
    await expect(page.getByText(/iniciando.+sesión/i)).toBeVisible({
      timeout: 2000,
    });

    // 6. Auth retorna sesión (token JWT) → Middleware verifica acceso
    // 7. Usuario activo → Acceso permitido → Mostrar Dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState("domcontentloaded");

    // Verificar que el área protegida (Dashboard) cargó correctamente
    await expect(page.locator("main").first()).toBeVisible();
  });
});
