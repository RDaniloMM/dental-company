import { test, expect } from "@playwright/test";
import { login, openSidebarIfMobile } from "../helpers/navigation";

/**
 * Test de Gestión de Citas - Creación de Nueva Cita
 * Flujo: Login → Citas → Nueva Cita → Formulario Modal → Seleccionar paciente/odontólogo
 *        → Fecha/hora → Guardar → Sincronizar con Google Calendar → Confirmación
 */
test.describe("Gestión de Citas", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Creación de cita nueva", async ({ page }) => {
    // 1. Navegar a sección 'Citas' desde el sidebar
    await openSidebarIfMobile(page);
    const citasLink = page.locator('a[href="/admin/citas"]');
    await citasLink.click();
    await page.waitForLoadState("networkidle");

    // 2. Verificar estado de conexión con Google Calendar (opcional)
    const connectionStatus = page.locator(
      '[data-testid="calendar-status"], .calendar-status'
    );
    if (await connectionStatus.isVisible()) {
      console.log("Estado de conexión con Google Calendar visible");
    }

    // 3. Hacer clic en 'Nueva cita'
    const newAppointmentButton = page.getByRole("button", {
      name: /nueva.+cita|crear.+cita|agregar/i,
    });
    await expect(newAppointmentButton).toBeVisible({ timeout: 10000 });
    await newAppointmentButton.click();

    // 4. El formulario modal se abre correctamente
    const modal = page.locator('[role="dialog"], .modal, .swal2-popup');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // 5. Seleccionar paciente del dropdown
    const patientSelect = page.locator(
      'select[name*="paciente"], #paciente_id'
    );
    if (await patientSelect.isVisible()) {
      const patientOptions = await patientSelect.locator("option").count();
      if (patientOptions > 1) {
        await patientSelect.selectOption({ index: 1 });
      }
    }

    // 6. Elegir odontólogo responsable
    const dentistSelect = page.locator(
      'select[name*="odontologo"], #odontologo_id'
    );
    if (await dentistSelect.isVisible()) {
      const dentistOptions = await dentistSelect.locator("option").count();
      if (dentistOptions > 1) {
        await dentistSelect.selectOption({ index: 1 });
      }
    }

    // 7. Especificar motivo de la cita
    const motiveField = page.locator(
      'textarea[name*="motivo"], #motivo, input[name*="motivo"]'
    );
    if (await motiveField.isVisible()) {
      await motiveField.fill("Control y limpieza dental");
    }

    // 8. Seleccionar fecha y hora
    const dateTimeField = page.locator(
      'input[id*="fecha"], #fecha_inicio, input[type="datetime-local"]'
    );
    if (await dateTimeField.isVisible()) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const dateString = futureDate.toISOString().slice(0, 16);
      await dateTimeField.fill(dateString);
    }

    // 9. Configurar duración (si disponible)
    const durationSelect = page.locator('select[name*="duracion"], #duracion');
    if (await durationSelect.isVisible()) {
      await durationSelect.selectOption("60");
    }

    // 10. Guardar cita
    const saveButton = page.getByRole("button", {
      name: /guardar|confirmar|crear|agendar/i,
    });
    await saveButton.click();

    // 11. Verificar creación exitosa (cita guardada en DB y Google Calendar)
    const successMessage = page.getByText(
      /cita.+registrada|cita.+creada|éxito|guardad/i
    );
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    await page.waitForLoadState("networkidle");
  });
});
