import { test, expect } from "@playwright/test";
import { login, navigateToPatientsList } from "../helpers/navigation";

/**
 * Test de Ficha Odontológica - Datos de Filiación
 * Flujo: Login → Historias Clínicas → Seleccionar Paciente → Ver Ficha → Pestaña Filiación
 *        → Completar datos personales/contacto/emergencia → Guardar → Verificar persistencia
 */
test.describe("Ficha Odontológica", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Login y navegación a ficha de paciente
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

    // 2. Navegar a lista de pacientes
    await navigateToPatientsList(page);

    // 3. Abrir ficha del primer paciente
    const firstPatient = page.locator("tbody tr, .patient-item").first();
    await expect(firstPatient).toBeVisible({ timeout: 5000 });

    const viewRecordButton = firstPatient.getByRole("button", {
      name: /ver.+ficha|ficha/i,
    });
    if (await viewRecordButton.isVisible()) {
      await viewRecordButton.click();
    } else {
      await firstPatient.locator("button, a").first().click();
    }

    await page.waitForLoadState("networkidle");
  });

  test("Completar datos de filiación", async ({ page }) => {
    // 4. Navegar a pestaña 'Filiación'
    const filiacionTab = page.getByRole("tab", { name: /filiación|datos/i });
    if (await filiacionTab.isVisible()) {
      await filiacionTab.click();
    } else {
      const filiacionLink = page.getByRole("link", { name: /filiación/i });
      if (await filiacionLink.isVisible()) {
        await filiacionLink.click();
      }
    }

    await page.waitForLoadState("networkidle");

    // 5. Completar datos personales faltantes
    const occupationField = page.getByLabel(/ocupación|trabajo|profesión/i);
    if (
      (await occupationField.isVisible()) &&
      (await occupationField.inputValue()) === ""
    ) {
      await occupationField.fill("Contador Público");
    }

    const phoneField = page.getByLabel(/teléfono|celular/i);
    if (
      (await phoneField.isVisible()) &&
      (await phoneField.inputValue()) === ""
    ) {
      await phoneField.fill("987654321");
    }

    const emailField = page.getByLabel(/email|correo/i);
    if (
      (await emailField.isVisible()) &&
      (await emailField.inputValue()) === ""
    ) {
      const uniqueEmail = `paciente${Date.now()}@test.com`;
      await emailField.fill(uniqueEmail);
    }

    // 6. Configurar contacto de emergencia
    const emergencyNameField = page.getByLabel(
      /contacto.+emergencia|emergencia.+nombre/i
    );
    if (
      (await emergencyNameField.isVisible()) &&
      (await emergencyNameField.inputValue()) === ""
    ) {
      await emergencyNameField.fill("Ana Pérez García");
    }

    // 7. Incluir datos de ubicación
    const addressField = page.getByLabel(/dirección|domicilio/i);
    if (
      (await addressField.isVisible()) &&
      (await addressField.inputValue()) === ""
    ) {
      await addressField.fill("Av. Bolognesi 456, Tacna, Perú");
    }

    // 8. Guardar cambios
    const saveButton = page.getByRole("button", {
      name: /guardar|actualizar|save/i,
    });
    await saveButton.click();

    // 9. Verificar que los datos se guardan
    const successMessage = page.getByText(/guardado|actualizado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });
});
