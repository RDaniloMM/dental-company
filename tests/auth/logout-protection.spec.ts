import { test, expect } from "@playwright/test";

test.describe("Autenticación y Acceso", () => {
  test("Logout y protección de rutas", async ({ page }) => {
    // Navegar directamente a la página de login
    await page.goto("https://dental-company-tacna.vercel.app/admin/login");

    // Verificar que la página de login se carga
    await expect(page).toHaveURL(/\/admin\/login/);

    // Iniciar sesión exitosamente
    await page.getByLabel(/usuario/i).fill("admin");
    await page.getByLabel(/contraseña/i).fill("admin123");
    await page.getByRole("button", { name: /iniciar.+sesión/i }).click();

    // Navegar al dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

    // Esperar a que la página cargue completamente
    await page.waitForLoadState("networkidle");

    // Verificar que estamos en el área protegida (buscar elementos comunes del dashboard)
    await expect(
      page
        .locator('main, [role="main"], .dashboard, [data-testid="dashboard"]')
        .first()
    ).toBeVisible({ timeout: 5000 });

    // Hacer clic en el botón de cerrar sesión
    const logoutButton = page
      .getByRole("button", { name: /cerrar.+sesión|logout|salir/i })
      .first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Verificar redirección a página principal
      await expect(page).toHaveURL("https://dental-company-tacna.vercel.app/", {
        timeout: 5000,
      });
    } else {
      // Buscar en menú de usuario si el logout no es directo
      const userMenu = page.getByRole("button", {
        name: /usuario|perfil|menu/i,
      });
      if (await userMenu.isVisible()) {
        await userMenu.click();
        const logoutOption = page.getByRole("menuitem", {
          name: /cerrar.+sesión|logout|salir/i,
        });
        await logoutOption.click();
        await expect(page).toHaveURL(
          "https://dental-company-tacna.vercel.app/",
          { timeout: 5000 }
        );
      }
    }

    // Intentar acceder a ruta protegida directamente
    await page.goto("https://dental-company-tacna.vercel.app/admin/dashboard");

    // Verificar redirección a login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });

    // No se puede acceder sin autenticación
    await expect(page.getByText(/iniciar.+sesión|login/i)).toBeVisible();
  });
});
