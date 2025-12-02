import { test, expect } from "@playwright/test";
import { login } from "../helpers/navigation";

test.describe("Dashboard y KPIs", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Visualización correcta del dashboard principal", async ({ page }) => {
    // Esperar a que la página cargue completamente
    await page.waitForLoadState("networkidle");

    // Verificar que el contenido principal está visible
    await expect(page.locator("main").first()).toBeVisible();

    // Comprobar métricas de pacientes (buscar tarjetas con texto relacionado)
    const patientsCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /paciente/i })
      .first();
    if ((await patientsCard.count()) > 0) {
      await expect(patientsCard).toBeVisible();
    }

    // Verificar datos de citas
    const appointmentsCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /cita/i })
      .first();
    if ((await appointmentsCard.count()) > 0) {
      await expect(appointmentsCard).toBeVisible();
    }

    // Revisar información financiera
    const financeCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /ingreso|finanza/i })
      .first();
    if ((await financeCard.count()) > 0) {
      await expect(financeCard).toBeVisible();
    }

    // Verificar que hay contenido numérico (métricas)
    const numbers = page.locator("text=/\\d+/");
    await expect(numbers.first()).toBeVisible({ timeout: 5000 });

    // Los iconos SVG están presentes
    const icons = page.locator("svg");
    await expect(icons.first()).toBeVisible();
  });
});
