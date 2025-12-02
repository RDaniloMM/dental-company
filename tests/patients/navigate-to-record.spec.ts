import { test, expect } from "@playwright/test";
import { login, navigateToPatientsList } from "../helpers/navigation";

test.describe("Gestión de Pacientes", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Navegación a ficha odontológica", async ({ page }) => {
    // Acceder a la lista de Historias Clínicas
    await navigateToPatientsList(page);

    // Localizar paciente en la lista
    const patientRows = page.locator(
      'tbody tr, .patient-item, [data-testid="patient-row"]'
    );
    await expect(patientRows.first()).toBeVisible({ timeout: 5000 });

    // Buscar el primer paciente disponible
    const firstPatient = patientRows.first();

    // Hacer clic en 'Ver Ficha'
    const viewRecordButton = firstPatient.getByRole("link", {
      name: /ver.+ficha|ficha|abrir/i,
    });
    if (await viewRecordButton.isVisible()) {
      await viewRecordButton.click();
    } else {
      // Buscar botón en la fila
      const actionButton = firstPatient.locator("button, a").first();
      await actionButton.click();
    }

    // Verificar carga de datos del paciente
    await page.waitForLoadState("networkidle");

    // La ficha se abre correctamente
    await expect(page).toHaveURL(/\/admin\/ficha-odontologica\/\d+/);

    // Verificar que se cargan datos básicos del paciente
    const patientName = page.locator(
      'h1, h2, .patient-name, [data-testid="patient-name"]'
    );
    await expect(patientName).toBeVisible({ timeout: 5000 });

    // Explorar pestañas de la ficha
    const tabs = page.locator('[role="tab"], .tab, [data-testid="tab"]');
    if ((await tabs.count()) > 0) {
      // Verificar pestaña de filiación
      const filiacionTab = page.getByRole("tab", { name: /filiación|datos/i });
      if (await filiacionTab.isVisible()) {
        await filiacionTab.click();
        await expect(
          page.getByText(/filiación|datos.+personales/i)
        ).toBeVisible();
      }

      // Verificar pestaña de historia clínica
      const historiaTab = page.getByRole("tab", {
        name: /historia.+clínica|antecedentes/i,
      });
      if (await historiaTab.isVisible()) {
        await historiaTab.click();
        await expect(page.getByText(/historia|antecedentes/i)).toBeVisible();
      }

      // Verificar pestaña de imágenes
      const imagenesTab = page.getByRole("tab", { name: /imágenes|fotos/i });
      if (await imagenesTab.isVisible()) {
        await imagenesTab.click();
        await expect(page.getByText(/imágenes|galería/i)).toBeVisible();
      }

      // Verificar pestaña de odontograma
      const odontogramaTab = page.getByRole("tab", {
        name: /odontograma|dental/i,
      });
      if (await odontogramaTab.isVisible()) {
        await odontogramaTab.click();
        await expect(page.getByText(/odontograma/i)).toBeVisible();
      }
    }

    // Comprobar información mostrada
    const patientInfo = page.locator(
      '.patient-info, [data-testid="patient-details"]'
    );
    if (await patientInfo.isVisible()) {
      console.log("Información del paciente cargada correctamente");
    }

    // Verificar navegación entre secciones
    const navigationElements = page.locator(
      'nav, .navigation, [role="navigation"]'
    );
    if ((await navigationElements.count()) > 0) {
      console.log("Navegación entre secciones funcional");
    }

    // Verificar breadcrumbs o navegación de regreso
    const backButton = page.getByRole("button", {
      name: /volver|regresar|atrás/i,
    });
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL(/\/admin\/.*pacientes/);
    }
  });
});
