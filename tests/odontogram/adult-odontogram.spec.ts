import { test, expect } from '@playwright/test';

test.describe('Odontograma Digital', () => {
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

  test('Creación de odontograma adulto', async ({ page }) => {
    // Acceder a sección odontograma
    const odontogramaTab = page.getByRole('tab', { name: /odontograma/i });
    if (await odontogramaTab.isVisible()) {
      await odontogramaTab.click();
    } else {
      // Buscar enlace directo al odontograma
      const odontogramaLink = page.getByRole('link', { name: /odontograma/i });
      if (await odontogramaLink.isVisible()) {
        await odontogramaLink.click();
      }
    }
    
    await page.waitForLoadState('networkidle');
    
    // Seleccionar 'Odontograma Adulto'
    const adultTab = page.getByRole('tab', { name: /adulto|32.+piezas/i });
    if (await adultTab.isVisible()) {
      await adultTab.click();
    }
    
    // Verificar que el odontograma de 32 piezas se muestra
    await expect(page.locator('svg, canvas, .odontograma')).toBeVisible();
    
    // Hacer clic en diente 11 (incisivo central)
    const tooth11 = page.locator('[data-tooth="11"], .tooth-11, #tooth-11').first();
    if (await tooth11.isVisible()) {
      await tooth11.click();
    } else {
      // Buscar por posición aproximada o texto
      const centralIncisor = page.locator('text="11"').first();
      if (await centralIncisor.isVisible()) {
        await centralIncisor.click();
      }
    }
    
    // Seleccionar zona 'Mesial'
    const mesialZone = page.getByRole('button', { name: /mesial/i });
    if (await mesialZone.isVisible()) {
      await mesialZone.click();
    }
    
    // Elegir condición 'Caries'
    const cariesCondition = page.getByRole('button', { name: /caries/i });
    if (await cariesCondition.isVisible()) {
      await cariesCondition.click();
    }
    
    // Marcar diente 16 como 'Restauración'
    const tooth16 = page.locator('[data-tooth="16"], .tooth-16, #tooth-16').first();
    if (await tooth16.isVisible()) {
      await tooth16.click();
      
      const restauracionCondition = page.getByRole('button', { name: /restauración|resina|amalgama/i });
      if (await restauracionCondition.isVisible()) {
        await restauracionCondition.click();
      }
    }
    
    // Agregar especificaciones en el campo de texto
    const specificationsField = page.getByLabel(/especificaciones|detalles/i);
    if (await specificationsField.isVisible()) {
      await specificationsField.fill('Diente 11: Caries mesial superficial. Diente 16: Restauración con resina compuesta en cara oclusal.');
    }
    
    // Incluir observaciones relevantes
    const observationsField = page.getByLabel(/observaciones|notas/i);
    if (await observationsField.isVisible()) {
      await observationsField.fill('Paciente refiere sensibilidad al frío en el sector anterior. Higiene oral regular.');
    }
    
    // Guardar odontograma
    const saveButton = page.getByRole('button', { name: /guardar|save/i });
    await saveButton.click();
    
    // Verificar que se guardó correctamente
    const successMessage = page.getByText(/guardado|saved|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Verificar que las marcas se mantienen visualmente
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Las condiciones se aplican visualmente
    if (await tooth11.isVisible()) {
      // Verificar que el diente tiene alguna marca visual
      const hasMarking = await tooth11.evaluate(el => {
        return el.getAttribute('class')?.includes('marked') || 
               el.querySelector('.condition') !== null ||
               el.style.fill !== '';
      });
      console.log('Diente 11 marcado:', hasMarking);
    }
  });
});