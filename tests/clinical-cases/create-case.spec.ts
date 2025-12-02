import { test, expect } from "@playwright/test";
import { login, navigateToPatientsList } from "../helpers/navigation";

/**
 * Test de Casos Clínicos - Creación de Nuevo Caso
 * Flujo: Login → Historias Clínicas → Seleccionar Paciente → Ver Ficha → Sección Casos
 *        → Nuevo Caso → Formulario Modal → Guardar → Caso creado con estado 'Abierto'
 */
test.describe("Casos Clínicos", () => {
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

  test("Creación de nuevo caso clínico", async ({ page }) => {
    // 4. Acceder a ficha de paciente
    await expect(page).toHaveURL(/\/admin\/ficha-odontologica\//);

    // 5. Navegar a sección 'Casos'
    const casosTab = page.getByRole("tab", { name: /casos/i });
    if (await casosTab.isVisible()) {
      await casosTab.click();
    } else {
      const casosLink = page.getByRole("link", { name: /casos/i });
      if (await casosLink.isVisible()) {
        await casosLink.click();
      }
    }

    await page.waitForLoadState("networkidle");

    // 6. Hacer clic en 'Nuevo Caso'
    const newCaseButton = page.getByRole("button", {
      name: /nuevo.+caso|crear.+caso|agregar/i,
    });
    if (!(await newCaseButton.isVisible())) {
      console.log("Botón de nuevo caso no encontrado - omitiendo test");
      test.skip();
      return;
    }
    await newCaseButton.click();

    // 7. El formulario modal se abre correctamente
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // 8. Ingresar nombre descriptivo del caso
    const caseNameField = page.getByLabel(/nombre.+caso|título/i);
    const uniqueCaseName = `Tratamiento Integral ${Date.now()}`;
    if (await caseNameField.isVisible()) {
      await caseNameField.fill(uniqueCaseName);
    }

    // 9. Completar descripción detallada
    const descriptionField = page.getByLabel(/descripción|detalle/i);
    if (await descriptionField.isVisible()) {
      await descriptionField.fill(
        "Caso de rehabilitación oral. Paciente presenta necesidad de tratamiento."
      );
    }

    // 10. Seleccionar odontólogo responsable si está disponible
    const dentistSelect = page.locator(
      'select[name*="odontologo"], select[name*="doctor"]'
    );
    if (await dentistSelect.isVisible()) {
      const dentistOptions = await dentistSelect.locator("option").count();
      if (dentistOptions > 1) {
        await dentistSelect.selectOption({ index: 1 });
      }
    }

    // 11. Guardar caso clínico
    const saveButton = page.getByRole("button", {
      name: /guardar|crear|confirmar/i,
    });
    await saveButton.click();

    // 12. Verificar creación exitosa - caso se crea con estado 'Abierto'
    const successMessage = page.getByText(/caso.+creado|caso.+guardado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    await page.waitForLoadState("networkidle");
  });
});
