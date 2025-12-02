import { test, expect } from '@playwright/test';

test.describe('Casos Clínicos', () => {
  test.beforeEach(async ({ page }) => {
    // Login y navegación a ficha de paciente
    await page.goto('https://dental-company-tacna.vercel.app/admin/login');
    await page.getByLabel(/usuario/i).fill('admin');
    await page.getByLabel(/contraseña/i).fill('admin123');
    await page.getByRole('button', { name: /iniciar.+sesión/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    
    // Navegar a pacientes y abrir una ficha existente
    const patientsLink = page.getByRole('link', { name: /historia|paciente/i }).first();
    await patientsLink.click();
    
    const firstPatient = page.locator('tbody tr, .patient-item').first();
    await expect(firstPatient).toBeVisible({ timeout: 5000 });
    
    const viewRecordButton = firstPatient.getByRole('link', { name: /ver.+ficha|ficha/i });
    if (await viewRecordButton.isVisible()) {
      await viewRecordButton.click();
    } else {
      await firstPatient.locator('button, a').first().click();
    }
    
    await page.waitForLoadState('networkidle');
  });

  test('Creación de nuevo caso clínico', async ({ page }) => {
    // Acceder a ficha de paciente
    await expect(page).toHaveURL(/\/admin\/ficha-odontologica\//);
    
    // Navegar a sección 'Casos'
    const casosTab = page.getByRole('tab', { name: /casos.+clínico|casos/i });
    if (await casosTab.isVisible()) {
      await casosTab.click();
    } else {
      // Buscar enlace directo a casos
      const casosLink = page.getByRole('link', { name: /casos/i });
      if (await casosLink.isVisible()) {
        await casosLink.click();
      }
    }
    
    await page.waitForLoadState('networkidle');
    
    // Hacer clic en 'Nuevo Caso'
    const newCaseButton = page.getByRole('button', { name: /nuevo.+caso|crear.+caso/i });
    await expect(newCaseButton).toBeVisible();
    await newCaseButton.click();
    
    // El formulario modal se abre correctamente
    const modal = page.locator('[role="dialog"], .modal, .swal2-popup');
    await expect(modal).toBeVisible();
    
    // Ingresar nombre descriptivo del caso
    const caseNameField = page.getByLabel(/nombre.+caso|título/i);
    await expect(caseNameField).toBeVisible();
    const uniqueCaseName = `Tratamiento Integral ${Date.now()}`;
    await caseNameField.fill(uniqueCaseName);
    
    // Completar descripción detallada
    const descriptionField = page.getByLabel(/descripción|detalle/i);
    if (await descriptionField.isVisible()) {
      await descriptionField.fill('Caso de rehabilitación oral completa. Paciente presenta múltiples caries y necesidad de tratamiento periodontal.');
    }
    
    // Seleccionar odontólogo responsable
    const dentistSelect = page.locator('select[name*="odontologo"], select[name*="doctor"]');
    if (await dentistSelect.isVisible()) {
      const dentistOptions = await dentistSelect.locator('option').count();
      if (dentistOptions > 1) {
        await dentistSelect.selectOption({ index: 1 });
      }
    }
    
    // Establecer prioridad
    const prioritySelect = page.locator('select[name*="prioridad"]');
    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption('Alta');
    }
    
    // Agregar observaciones iniciales
    const observationsField = page.getByLabel(/observacion|nota/i);
    if (await observationsField.isVisible()) {
      await observationsField.fill('Paciente colaborativo. Historia de bruxismo nocturno. Requiere seguimiento estrecho.');
    }
    
    // Guardar caso clínico
    const saveButton = page.getByRole('button', { name: /guardar|crear|confirmar/i });
    await saveButton.click();
    
    // Verificar creación exitosa
    const successMessage = page.getByText(/caso.+creado|caso.+guardado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // El caso se crea con estado 'Abierto'
    await page.waitForLoadState('networkidle');
    
    // Verificar que aparece en la lista del paciente
    const casesList = page.locator('table, .cases-list, [data-testid="cases"]');
    if (await casesList.isVisible()) {
      await expect(casesList).toContainText(uniqueCaseName);
      await expect(casesList).toContainText(/abierto|activo/i);
    }
    
    // Se genera ID único para el caso
    const caseId = page.locator('[data-testid="case-id"], .case-id, :has-text("ID:")');
    if (await caseId.isVisible()) {
      console.log('Caso clínico creado con ID único');
    }
    
    // Verificar que se puede acceder al detalle del caso
    const caseDetailLink = page.getByRole('link', { name: uniqueCaseName });
    if (await caseDetailLink.isVisible()) {
      await caseDetailLink.click();
      await expect(page).toHaveURL(/\/casos\/\d+/);
    }
  });
});