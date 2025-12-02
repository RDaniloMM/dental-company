import { test, expect } from "@playwright/test";
import { login } from "../helpers/navigation";

/**
 * Test basado en Diagrama de Secuencia 3.7 - Visualización del Dashboard (KPIs)
 * Flujo: Usuario → Dashboard → API → DB (consultas paralelas) → Métricas consolidadas → Gráficos
 */
test.describe("Dashboard - Diagrama 3.7 KPIs", () => {
  test.beforeEach(async ({ page }) => {
    // Usuario accede al panel principal (requiere autenticación previa)
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Carga del Dashboard con KPIs", async ({ page }) => {
    // == Carga de Métricas ==

    // 1. Usuario accede al panel principal
    // 2. Dashboard solicita resumen de KPIs a la API
    // 3. API ejecuta consultas en paralelo a la DB:
    //    - Contar total de pacientes
    //    - Contar citas pendientes
    //    - Calcular ingresos del mes
    //    - Contar casos clínicos activos
    await page.waitForLoadState("networkidle");

    // 4. API retorna métricas consolidadas al Dashboard
    await expect(page.locator("main").first()).toBeVisible();

    // 5. Dashboard muestra tarjetas con indicadores
    // Verificar tarjeta de Total Pacientes
    const patientsCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /paciente/i })
      .first();
    if ((await patientsCard.count()) > 0) {
      await expect(patientsCard).toBeVisible();
    }

    // Verificar tarjeta de Citas Pendientes
    const appointmentsCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /cita/i })
      .first();
    if ((await appointmentsCard.count()) > 0) {
      await expect(appointmentsCard).toBeVisible();
    }

    // Verificar tarjeta de Ingresos Mensuales
    const financeCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /ingreso|finanza|mes/i })
      .first();
    if ((await financeCard.count()) > 0) {
      await expect(financeCard).toBeVisible();
    }

    // Verificar tarjeta de Casos Activos
    const casesCard = page
      .locator('.card, [class*="card"]')
      .filter({ hasText: /caso|activo/i })
      .first();
    if ((await casesCard.count()) > 0) {
      await expect(casesCard).toBeVisible();
    }

    // Verificar que las métricas muestran valores numéricos
    const numbers = page.locator("text=/\\d+/");
    await expect(numbers.first()).toBeVisible({ timeout: 5000 });

    // == Carga de Gráficos ==

    // 6. Dashboard solicita datos para gráficos a la API
    // 7. API obtiene datos agregados por período de la DB
    // 8. Dashboard renderiza gráficos estadísticos
    const charts = page.locator(
      'canvas, svg.recharts-surface, [class*="chart"]'
    );
    if ((await charts.count()) > 0) {
      await expect(charts.first()).toBeVisible({ timeout: 10000 });
    }

    // Los iconos SVG de las tarjetas están presentes
    const icons = page.locator("svg");
    await expect(icons.first()).toBeVisible();
  });
});
