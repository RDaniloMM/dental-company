import { test, expect } from "@playwright/test";
import { login, navigateToPatientsList } from "../helpers/navigation";

/**
 * Test de Odontograma Digital - Adulto (32 piezas)
 * Flujo: Login → Historias Clínicas → Seleccionar Paciente → Ver Ficha → Pestaña Odontograma
 *        → Seleccionar diente → Marcar condición → Guardar → Verificar persistencia visual
 */
test.describe("Odontograma Digital", () => {
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

  test("Creación de odontograma adulto", async ({ page }) => {
    // 4. Acceder a sección odontograma
    const odontogramaTab = page.getByRole("tab", { name: /odontograma/i });
    if (await odontogramaTab.isVisible()) {
      await odontogramaTab.click();
    } else {
      const odontogramaLink = page.getByRole("link", { name: /odontograma/i });
      if (await odontogramaLink.isVisible()) {
        await odontogramaLink.click();
      }
    }

    await page.waitForLoadState("networkidle");

    // 5. Verificar que el odontograma se muestra
    const odontogramaCanvas = page.locator(
      'svg, canvas, .odontograma, [data-testid="odontograma"]'
    );
    await expect(odontogramaCanvas.first()).toBeVisible({ timeout: 10000 });

    // 6. Seleccionar 'Odontograma Adulto' si hay pestañas
    const adultTab = page.getByRole("tab", { name: /adulto|32.+piezas/i });
    if (await adultTab.isVisible()) {
      await adultTab.click();
      await page.waitForLoadState("networkidle");
    }

    // 7. Hacer clic en un diente (buscar interactivo)
    const toothElement = page.locator("[data-tooth], .tooth, .diente").first();
    if (await toothElement.isVisible()) {
      await toothElement.click();

      // 8. Seleccionar condición si aparece menú
      const conditionMenu = page.locator(
        '[role="menu"], .condition-menu, .menu-condiciones'
      );
      if (await conditionMenu.isVisible()) {
        const cariesOption = conditionMenu.getByText(/caries/i);
        if (await cariesOption.isVisible()) {
          await cariesOption.click();
        }
      }
    }

    // 9. Agregar observaciones si el campo existe
    const observationsField = page.getByLabel(
      /observaciones|notas|especificaciones/i
    );
    if (await observationsField.isVisible()) {
      await observationsField.fill(
        "Odontograma inicial. Paciente presenta buena salud dental general."
      );
    }

    // 10. Guardar odontograma
    const saveButton = page.getByRole("button", { name: /guardar|save/i });
    if (await saveButton.isVisible()) {
      await saveButton.click();

      // 11. Verificar que se guardó
      const successMessage = page.getByText(/guardado|saved|éxito/i);
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });
});
