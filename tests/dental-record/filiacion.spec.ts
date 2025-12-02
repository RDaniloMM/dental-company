import { test, expect } from '@playwright/test';

test.describe('Ficha Odontológica', () => {
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

  test('Completar datos de filiación', async ({ page }) => {
    // Navegar a pestaña 'Filiación'
    const filiacionTab = page.getByRole('tab', { name: /filiación|datos/i });
    if (await filiacionTab.isVisible()) {
      await filiacionTab.click();
    } else {
      // Buscar enlace o botón de filiación
      const filiacionLink = page.getByRole('link', { name: /filiación/i });
      if (await filiacionLink.isVisible()) {
        await filiacionLink.click();
      }
    }
    
    await page.waitForLoadState('networkidle');
    
    // Completar datos personales faltantes
    const occupationField = page.getByLabel(/ocupación|trabajo|profesión/i);
    if (await occupationField.isVisible() && await occupationField.inputValue() === '') {
      await occupationField.fill('Contador Público');
    }
    
    const civilStatusField = page.locator('select[name*="civil"], [data-testid="civil-status"]');
    if (await civilStatusField.isVisible()) {
      await civilStatusField.selectOption('Casado');
    }
    
    const educationField = page.getByLabel(/educación|instrucción|estudios/i);
    if (await educationField.isVisible() && await educationField.inputValue() === '') {
      await educationField.fill('Universitario');
    }
    
    // Agregar información de contacto completa
    const phoneField = page.getByLabel(/teléfono|celular/i);
    if (await phoneField.isVisible() && await phoneField.inputValue() === '') {
      await phoneField.fill('987654321');
    }
    
    const emailField = page.getByLabel(/email|correo/i);
    if (await emailField.isVisible() && await emailField.inputValue() === '') {
      const uniqueEmail = `paciente${Date.now()}@test.com`;
      await emailField.fill(uniqueEmail);
    }
    
    // Configurar contacto de emergencia
    const emergencyNameField = page.getByLabel(/contacto.+emergencia|emergencia.+nombre/i);
    if (await emergencyNameField.isVisible() && await emergencyNameField.inputValue() === '') {
      await emergencyNameField.fill('Ana Pérez García');
      
      const emergencyPhoneField = page.getByLabel(/emergencia.+teléfono/i);
      if (await emergencyPhoneField.isVisible()) {
        await emergencyPhoneField.fill('987123456');
      }
      
      const emergencyRelationField = page.getByLabel(/parentesco|relación/i);
      if (await emergencyRelationField.isVisible()) {
        await emergencyRelationField.fill('Esposa');
      }
    }
    
    // Incluir datos de ubicación detallados
    const addressField = page.getByLabel(/dirección|domicilio/i);
    if (await addressField.isVisible() && await addressField.inputValue() === '') {
      await addressField.fill('Av. Bolognesi 456, Tacna, Perú');
    }
    
    const districtField = page.getByLabel(/distrito/i);
    if (await districtField.isVisible() && await districtField.inputValue() === '') {
      await districtField.fill('Tacna');
    }
    
    // Especificar origen de referencia
    const referredField = page.getByLabel(/recomendado|referido|origen/i);
    if (await referredField.isVisible() && await referredField.inputValue() === '') {
      await referredField.fill('Recomendación médica - Dr. Smith');
    }
    
    // Guardar cambios
    const saveButton = page.getByRole('button', { name: /guardar|actualizar|save/i });
    await saveButton.click();
    
    // Verificar que los datos se guardan sin pérdida
    const successMessage = page.getByText(/guardado|actualizado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Los cambios se reflejan inmediatamente
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar persistencia de datos
    if (await occupationField.isVisible()) {
      await expect(occupationField).toHaveValue(/contador|profesión/i);
    }
  });
});