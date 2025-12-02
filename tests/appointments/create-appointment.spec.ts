import { test, expect } from '@playwright/test';

test.describe('Gestión de Citas', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('https://dental-company-tacna.vercel.app/admin/login');
    await page.getByLabel(/usuario/i).fill('admin');
    await page.getByLabel(/contraseña/i).fill('admin123');
    await page.getByRole('button', { name: /iniciar.+sesión/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test('Creación de cita nueva', async ({ page }) => {
    // Navegar a sección 'Citas'
    const citasLink = page.getByRole('link', { name: /citas|agenda/i });
    await citasLink.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verificar estado de conexión con Google Calendar
    const connectionStatus = page.locator('[data-testid="calendar-status"], .calendar-status, :has-text("Conectado")');
    if (await connectionStatus.isVisible()) {
      await expect(connectionStatus).toContainText(/conectado|connected/i);
    }
    
    // Hacer clic en 'Nueva cita'
    const newAppointmentButton = page.getByRole('button', { name: /nueva.+cita|crear.+cita/i });
    await expect(newAppointmentButton).toBeVisible();
    await newAppointmentButton.click();
    
    // El formulario modal se abre correctamente
    const modal = page.locator('[role="dialog"], .modal, .swal2-popup');
    await expect(modal).toBeVisible();
    
    // Seleccionar paciente del dropdown
    const patientSelect = page.locator('select[name*="paciente"], #paciente_id');
    await expect(patientSelect).toBeVisible();
    
    // Obtener primera opción disponible (que no sea el placeholder)
    const patientOptions = await patientSelect.locator('option').count();
    if (patientOptions > 1) {
      await patientSelect.selectOption({ index: 1 });
    }
    
    // Elegir odontólogo responsable
    const dentistSelect = page.locator('select[name*="odontologo"], #odontologo_id');
    if (await dentistSelect.isVisible()) {
      const dentistOptions = await dentistSelect.locator('option').count();
      if (dentistOptions > 1) {
        await dentistSelect.selectOption({ index: 1 });
      }
    }
    
    // Especificar motivo de la cita
    const motiveField = page.locator('textarea[name*="motivo"], #motivo');
    if (await motiveField.isVisible()) {
      await motiveField.fill('Control y limpieza dental');
    }
    
    // Seleccionar fecha y hora con flatpickr
    const dateTimeField = page.locator('input[id*="fecha"], #fecha_inicio');
    if (await dateTimeField.isVisible()) {
      // Crear una fecha futura
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // Una semana desde hoy
      const dateString = futureDate.toISOString().slice(0, 16).replace('T', ' ');
      
      await dateTimeField.fill(dateString);
    }
    
    // Configurar duración (60 minutos)
    const durationSelect = page.locator('select[name*="duracion"], #duracion');
    if (await durationSelect.isVisible()) {
      await durationSelect.selectOption('60');
    }
    
    // Establecer estado como 'Programada'
    const statusSelect = page.locator('select[name*="estado"], #estado');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('Programada');
    }
    
    // Agregar costo y moneda
    const costField = page.locator('input[name*="costo"], #costo_total');
    if (await costField.isVisible()) {
      await costField.fill('150.00');
    }
    
    const currencySelect = page.locator('select[name*="moneda"], #moneda_id');
    if (await currencySelect.isVisible()) {
      const currencyOptions = await currencySelect.locator('option').count();
      if (currencyOptions > 1) {
        await currencySelect.selectOption({ index: 1 });
      }
    }
    
    // Incluir notas adicionales
    const notesField = page.locator('textarea[name*="notas"], #notas');
    if (await notesField.isVisible()) {
      await notesField.fill('Primera consulta. Paciente refiere sensibilidad dental.');
    }
    
    // Guardar cita
    const saveButton = page.getByRole('button', { name: /guardar.+cita|confirmar|crear/i });
    await saveButton.click();
    
    // Verificar creación exitosa
    const successMessage = page.getByText(/cita.+registrada|cita.+creada|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    // La cita se guarda en la base de datos y Google Calendar
    await page.waitForLoadState('networkidle');
    
    // Verificar que aparece en la lista de citas
    const appointmentsList = page.locator('table, .appointments-list, [data-testid="appointments"]');
    if (await appointmentsList.isVisible()) {
      await expect(appointmentsList).toContainText(/control.+limpieza|programada/i);
    }
  });
});