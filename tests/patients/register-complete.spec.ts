import { test, expect } from "@playwright/test";
import { login, navigateToNewPatient } from "../helpers/navigation";

/**
 * Test de Gestión de Pacientes - Registro Completo con Ficha
 * Flujo: Login → Historias Clínicas → Nuevo Paciente → Datos Básicos → Registrar y Completar Ficha
 *        → Filiación Completa → Guardar → Ficha creada y navegable
 */
test.describe("Gestión de Pacientes", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Registro completo de paciente con ficha odontológica", async ({
    page,
  }) => {
    // 1. Navegar a Historias Clínicas → Nuevo Paciente
    await navigateToNewPatient(page);

    // 2. Dialog de registro se abre
    await expect(page.getByRole("dialog")).toBeVisible();

    const uniqueId = Date.now();

    // 3. Completar datos básicos obligatorios
    await page.getByLabel("Nombres *").fill(`María Complete ${uniqueId}`);
    await page.getByLabel("Apellidos *").fill("González Test");
    await page.getByLabel("DNI *").fill(uniqueId.toString().slice(-8));
    await page.getByLabel("Fecha de Nacimiento").fill("1985-05-15");
    await page.getByLabel("Email").fill(`test${uniqueId}@email.com`);

    // 4. Seleccionar género Femenino
    const genderTrigger = page
      .locator('button[role="combobox"]')
      .filter({ hasText: /masculino|femenino/i });
    if (await genderTrigger.isVisible()) {
      await genderTrigger.click();
      await page.getByRole("option", { name: /femenino/i }).click();
    }

    // 5. Elegir 'Registrar y Completar Ficha' para ir a filiación completa
    const completeRecordButton = page.getByRole("button", {
      name: /registrar.+completar.+ficha/i,
    });
    await completeRecordButton.click();

    // 6. Esperar redirección a la ficha de filiación
    await page.waitForURL(/\/admin\/ficha-odontologica\/.*\/filiacion/, {
      timeout: 15000,
    });
    await page.waitForLoadState("networkidle");

    // 7. Completar datos de filiación adicionales
    const occupationField = page.getByLabel(/ocupación|profesión/i);
    if (await occupationField.isVisible()) {
      await occupationField.fill("Ingeniera de Sistemas");
    }

    const phoneField = page.getByLabel(/teléfono|celular/i);
    if (await phoneField.isVisible()) {
      await phoneField.fill("987654321");
    }

    const addressField = page.getByLabel(/dirección|domicilio/i);
    if (await addressField.isVisible()) {
      await addressField.fill("Av. Test 123, Distrito Test");
    }

    // 8. Guardar ficha completa
    const saveFichaButton = page.getByRole("button", {
      name: /guardar|actualizar/i,
    });
    await saveFichaButton.click();

    // 9. Verificar éxito
    const successMessage = page.getByText(/guardado|actualizado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    // 10. Verificar que el nombre del paciente aparece en la ficha
    await expect(
      page.getByText(new RegExp(`María Complete ${uniqueId}`, "i"))
    ).toBeVisible({ timeout: 5000 });
  });
});
