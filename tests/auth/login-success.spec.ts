import { test, expect } from "@playwright/test";

// Suite: Autenticación y Acceso
test("Login exitoso con credenciales válidas", async ({ page }) => {
  // 1. Navegar directamente a la página de login
  await page.goto("https://dental-company-tacna.vercel.app/admin/login");

  // Verificar que la página de login se carga correctamente
  await expect(page).toHaveURL(/\/admin\/login/);

  // 3. Ingresar nombre de usuario válido en el campo 'Usuario'
  const usernameField = page.getByLabel(/usuario/i);
  await expect(usernameField).toBeVisible();
  await usernameField.fill("admin"); // Usuario de prueba

  // 4. Ingresar contraseña válida en el campo 'Contraseña'
  const passwordField = page.getByLabel(/contraseña/i);
  await expect(passwordField).toBeVisible();
  await passwordField.fill("admin123"); // Contraseña de prueba

  // 5. Hacer clic en el botón 'Iniciar Sesión'
  const loginButton = page.getByRole("button", { name: /iniciar.+sesión/i });
  await expect(loginButton).toBeEnabled();

  // Verificar mensaje de carga durante el proceso
  await loginButton.click();
  await expect(page.getByText(/iniciando.+sesión/i)).toBeVisible({
    timeout: 2000,
  });

  // 6. Verificar redirección al dashboard administrativo
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

  // Esperar a que la página cargue completamente
  await page.waitForLoadState("domcontentloaded");

  // Verificar que el área protegida cargó correctamente
  await expect(page.locator("main").first()).toBeVisible();
});
