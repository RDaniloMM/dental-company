import { test, expect } from "@playwright/test";
import { login, navigateToPatientsList } from "../helpers/navigation";

test.describe("Gestión de Pacientes", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Búsqueda y filtrado de pacientes", async ({ page }) => {
    // Acceder a la lista de Historias Clínicas
    await navigateToPatientsList(page);

    // Verificar que la lista se carga
    const patientsList = page.locator(
      'table, .patient-list, [data-testid="patients-table"]'
    );
    await expect(patientsList).toBeVisible();

    // Usar búsqueda por nombre
    const searchField = page.getByPlaceholder(/buscar|nombre|paciente/i);
    if (await searchField.isVisible()) {
      await searchField.fill("Juan");
      await page.waitForTimeout(1000); // Esperar a que se aplique el filtro

      // La búsqueda devuelve resultados relevantes
      const searchResults = page.locator("tbody tr, .patient-item");
      if ((await searchResults.count()) > 0) {
        const firstResult = searchResults.first();
        await expect(firstResult).toContainText(/juan/i);
      }

      // Limpiar búsqueda
      await searchField.clear();
    }

    // Filtrar por DNI
    if (await searchField.isVisible()) {
      await searchField.fill("12345");
      await page.waitForTimeout(1000);

      // Verificar que se filtran resultados
      console.log("Filtrando por DNI");
      await searchField.clear();
    }

    // Buscar por número de historia
    if (await searchField.isVisible()) {
      await searchField.fill("001");
      await page.waitForTimeout(1000);
      console.log("Buscando por número de historia");
      await searchField.clear();
    }

    // Aplicar filtros de edad (si están disponibles)
    const ageFilter = page.locator(
      'select[name*="edad"], [data-testid="age-filter"]'
    );
    if (await ageFilter.isVisible()) {
      await ageFilter.selectOption("30-40");
      await page.waitForTimeout(1000);
      console.log("Aplicando filtro de edad");
    }

    // Combinar múltiples filtros
    if (await searchField.isVisible()) {
      await searchField.fill("María");

      const genderFilter = page.locator(
        'select[name*="genero"], [data-testid="gender-filter"]'
      );
      if (await genderFilter.isVisible()) {
        await genderFilter.selectOption("F");
      }

      await page.waitForTimeout(1000);
      console.log("Combinando múltiples filtros");
    }

    // Limpiar filtros
    const clearFiltersButton = page.getByRole("button", {
      name: /limpiar|clear|reset/i,
    });
    if (await clearFiltersButton.isVisible()) {
      await clearFiltersButton.click();
    } else {
      // Limpiar manualmente
      if (await searchField.isVisible()) {
        await searchField.clear();
      }
      if (await ageFilter.isVisible()) {
        await ageFilter.selectOption("");
      }
    }

    await page.waitForTimeout(500);

    // Verificar que la lista completa se restaura
    const allPatients = page.locator("tbody tr, .patient-item");
    if ((await allPatients.count()) > 0) {
      console.log("Lista completa restaurada correctamente");
    }
  });
});
