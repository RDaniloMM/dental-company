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

  test('Registro de historia clínica - antecedentes', async ({ page }) => {
    // Ir a pestaña 'Historia Clínica'
    const historiaTab = page.getByRole('tab', { name: /historia.+clínica|antecedentes/i });
    if (await historiaTab.isVisible()) {
      await historiaTab.click();
    } else {
      // Buscar enlace directo a historia clínica
      const historiaLink = page.getByRole('link', { name: /historia.+clínica/i });
      if (await historiaLink.isVisible()) {
        await historiaLink.click();
      }
    }
    
    await page.waitForLoadState('networkidle');
    
    // Completar antecedentes cardiovasculares
    const cardiovascularSection = page.locator('[data-testid="cardiovascular"], .cardiovascular, :has-text("Cardiovascular")');
    if (await cardiovascularSection.isVisible()) {
      const hypertensionYes = cardiovascularSection.getByRole('radio', { name: /sí|yes/i }).first();
      if (await hypertensionYes.isVisible()) {
        await hypertensionYes.click();
        
        const observationsField = cardiovascularSection.getByLabel(/observacion|comentario/i);
        if (await observationsField.isVisible()) {
          await observationsField.fill('Hipertensión controlada con medicamentos');
        }
      }
    }
    
    // Registrar antecedentes respiratorios
    const respiratorySection = page.locator('[data-testid="respiratorio"], .respiratorio, :has-text("Respiratorio")');
    if (await respiratorySection.isVisible()) {
      const asthmaNo = respiratorySection.getByRole('radio', { name: /no/i }).first();
      if (await asthmaNo.isVisible()) {
        await asthmaNo.click();
      }
    }
    
    // Documentar condiciones endocrino-metabólicas
    const endocrinoSection = page.locator('[data-testid="endocrino"], .endocrino, :has-text("Endocrino")');
    if (await endocrinoSection.isVisible()) {
      const diabetesYes = endocrinoSection.getByRole('radio', { name: /sí|yes/i }).first();
      if (await diabetesYes.isVisible()) {
        await diabetesYes.click();
        
        const diabetesObs = endocrinoSection.getByLabel(/observacion/i);
        if (await diabetesObs.isVisible()) {
          await diabetesObs.fill('Diabetes tipo 2, controlada con dieta');
        }
      }
    }
    
    // Incluir antecedentes neurológico-psiquiátricos
    const neuroSection = page.locator('[data-testid="neurologico"], .neurologico, :has-text("Neurológico")');
    if (await neuroSection.isVisible()) {
      const epilepsyNo = neuroSection.getByRole('radio', { name: /no/i }).first();
      if (await epilepsyNo.isVisible()) {
        await epilepsyNo.click();
      }
    }
    
    // Registrar alergias conocidas
    const allergiesSection = page.locator('[data-testid="alergias"], .alergias, :has-text("Alergias")');
    if (await allergiesSection.isVisible()) {
      const allergiesYes = allergiesSection.getByRole('radio', { name: /sí|yes/i }).first();
      if (await allergiesYes.isVisible()) {
        await allergiesYes.click();
        
        const allergiesDetail = allergiesSection.getByLabel(/observacion|detalle/i);
        if (await allergiesDetail.isVisible()) {
          await allergiesDetail.fill('Alérgico a la penicilina y mariscos');
        }
      }
    }
    
    // Completar otros antecedentes relevantes
    const otherSection = page.locator('[data-testid="otros"], .otros, :has-text("Otros")');
    if (await otherSection.isVisible()) {
      const otherField = otherSection.getByLabel(/observacion|otros/i);
      if (await otherField.isVisible()) {
        await otherField.fill('Cirugía de apendicitis en 2010. Sin complicaciones.');
      }
    }
    
    // Guardar historia clínica
    const saveButton = page.getByRole('button', { name: /guardar|actualizar|save/i });
    await saveButton.click();
    
    // Verificar que se guarda correctamente
    const successMessage = page.getByText(/guardado|actualizado|éxito/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // La información se organiza por sistemas
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar persistencia de antecedentes
    if (await cardiovascularSection.isVisible()) {
      const selectedRadio = cardiovascularSection.getByRole('radio', { checked: true });
      await expect(selectedRadio).toBeVisible();
    }
  });
});