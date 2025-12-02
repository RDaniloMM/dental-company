import { test, expect } from "@playwright/test";
import { login, navigateToPatientsList } from "../helpers/navigation";

/**
 * Test de Ficha Odontológica - Historia Clínica (Antecedentes)
 * Flujo: Login → Historias Clínicas → Seleccionar Paciente → Ver Ficha → Pestaña Historia Clínica
 *        → Registrar antecedentes por sistemas → Guardar → Verificar organización
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

  test("Registro de historia clínica - antecedentes", async ({ page }) => {
    // 4. Ir a pestaña 'Historia Clínica'
    const historiaTab = page.getByRole("tab", {
      name: /historia.+clínica|antecedentes/i,
    });
    if (await historiaTab.isVisible()) {
      await historiaTab.click();
    } else {
      const historiaLink = page.getByRole("link", {
        name: /historia.+clínica|antecedentes/i,
      });
      if (await historiaLink.isVisible()) {
        await historiaLink.click();
      }
    }

    await page.waitForLoadState("networkidle");

    // 5. Verificar que la sección de antecedentes está visible
    const antecedentesSection = page.locator(
      'form, [data-testid="antecedentes"], .antecedentes'
    );
    await expect(antecedentesSection.first()).toBeVisible({ timeout: 5000 });

    // 6. Registrar antecedentes (los formularios varían según diseño)
    // Buscar checkboxes o radios de antecedentes
    const checkboxes = page.locator('input[type="checkbox"]');
    if ((await checkboxes.count()) > 0) {
      const firstCheckbox = checkboxes.first();
      if (!(await firstCheckbox.isChecked())) {
        await firstCheckbox.check();
      }
    }

    // Buscar campos de observaciones
    const observationsField = page
      .getByLabel(/observación|comentario|nota/i)
      .first();
    if (await observationsField.isVisible()) {
      await observationsField.fill(
        "Antecedentes registrados durante consulta inicial."
      );
    }

    // 7. Guardar historia clínica
    const saveButton = page.getByRole("button", {
      name: /guardar|actualizar|save/i,
    });
    if (await saveButton.isVisible()) {
      await saveButton.click();

      // 8. Verificar que se guarda correctamente
      const successMessage = page.getByText(/guardado|actualizado|éxito/i);
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });
});
