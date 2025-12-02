import { test, expect } from "@playwright/test";
import { login, navigateToNewPatient } from "../helpers/navigation";

test.describe("Gestión de Pacientes", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Registro completo de paciente con ficha odontológica", async ({
    page,
  }) => {
    // Navegar a Historias Clínicas → Nuevo Paciente
    await navigateToNewPatient(page);

    const uniqueId = Date.now();

    // Datos básicos
    await page.getByLabel(/nombre/i).fill(`María Complete ${uniqueId}`);
    await page.getByLabel(/apellido/i).fill(`González Test`);
    await page
      .getByLabel(/dni|documento/i)
      .fill(`${uniqueId.toString().slice(-8)}`);
    await page.getByLabel(/fecha.+nacimiento/i).fill("1985-05-15");

    // Seleccionar género
    const genderFemale = page.getByRole("radio", { name: /femenino|mujer|f/i });
    if (await genderFemale.isVisible()) {
      await genderFemale.click();
    }

    // Elegir 'Registrar y Completar Ficha'
    const completeRecordButton = page.getByRole("button", {
      name: /registrar.+completar.+ficha|completa/i,
    });
    if (await completeRecordButton.isVisible()) {
      await completeRecordButton.click();
    } else {
      // Crear paciente básico primero
      const saveButton = page.getByRole("button", {
        name: /guardar|registrar/i,
      });
      await saveButton.click();
      await page.waitForLoadState("networkidle");

      // Navegar a ficha completa
      const recordLink = page.getByRole("link", { name: /ficha|completar/i });
      if (await recordLink.isVisible()) {
        await recordLink.click();
      }
    }

    // Completar datos de filiación completos
    await page.waitForLoadState("networkidle");

    // Buscar y completar campos de filiación
    const occupationField = page.getByLabel(/ocupación|profesión/i);
    if (await occupationField.isVisible()) {
      await occupationField.fill("Ingeniera de Sistemas");
    }

    const civilStatusField = page.getByLabel(/estado.+civil|civil/i);
    if (await civilStatusField.isVisible()) {
      await civilStatusField.selectOption("Soltera");
    }

    // Agregar información de contacto
    const phoneField = page.getByLabel(/teléfono|celular/i);
    if (await phoneField.isVisible()) {
      await phoneField.fill("987654321");
    }

    const emailField = page.getByLabel(/email|correo/i);
    if (await emailField.isVisible()) {
      await emailField.fill(`test${uniqueId}@email.com`);
    }

    // Incluir contacto de emergencia (obligatorio)
    const emergencyNameField = page.getByLabel(
      /contacto.+emergencia|emergencia.+nombre/i
    );
    if (await emergencyNameField.isVisible()) {
      await emergencyNameField.fill("Carlos González");

      const emergencyPhoneField = page.getByLabel(
        /emergencia.+teléfono|teléfono.+emergencia/i
      );
      if (await emergencyPhoneField.isVisible()) {
        await emergencyPhoneField.fill("987123456");
      }

      const emergencyRelationField = page.getByLabel(/parentesco|relación/i);
      if (await emergencyRelationField.isVisible()) {
        await emergencyRelationField.fill("Hermano");
      }
    }

    // Agregar datos de ubicación
    const addressField = page.getByLabel(/dirección|domicilio/i);
    if (await addressField.isVisible()) {
      await addressField.fill("Av. Test 123, Distrito Test");
    }

    // Especificar cómo fue referido
    const referredField = page.getByLabel(/recomendado|referido/i);
    if (await referredField.isVisible()) {
      await referredField.fill("Recomendación familiar");
    }

    // Guardar ficha completa
    const saveFichaButton = page.getByRole("button", {
      name: /guardar|actualizar/i,
    });
    await saveFichaButton.click();

    // Verificar que se guardó correctamente
    const successMessage = page.getByText(/guardado|actualizado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // La ficha se crea completa y navegable
    await expect(page.getByText(`María Complete ${uniqueId}`)).toBeVisible();
  });
});
