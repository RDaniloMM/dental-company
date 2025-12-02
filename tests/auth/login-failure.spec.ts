import { test, expect } from "@playwright/test";

test.describe("Autenticación y Acceso", () => {
  test("Login fallido con credenciales inválidas", async ({ page }) => {
    // Navegar directamente a la página de login
    await page.goto("https://dental-company-tacna.vercel.app/admin/login");

    // Verificar que la página de login se carga
    await expect(page).toHaveURL(/\/admin\/login/);

    // Ingresar nombre de usuario inválido
    const usernameField = page.getByLabel(/usuario/i);
    await usernameField.fill("usuario_invalido");

    // Ingresar contraseña incorrecta
    const passwordField = page.getByLabel(/contraseña/i);
    await passwordField.fill("contraseña_incorrecta");

    // Hacer clic en 'Iniciar Sesión'
    const loginButton = page.getByRole("button", { name: /iniciar.+sesión/i });
    await loginButton.click();

    // Verificar mensaje de error
    await expect(
      page.getByText(/usuario.+o.+contraseña.+incorrectos/i)
    ).toBeVisible({ timeout: 5000 });

    // El usuario permanece en la página de login
    await expect(page).toHaveURL(/\/admin\/login/);

    // Los campos se mantienen visibles para reintento
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
