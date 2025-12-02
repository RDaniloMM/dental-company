import { test, expect } from "@playwright/test";

test.describe("Flujos de Navegación y UX", () => {
  test("Flujo completo: paciente nuevo a tratamiento", async ({ page }) => {
    // Navegar directamente a la página de login
    await page.goto("https://dental-company-tacna.vercel.app/admin/login");

    // Verificar que la página de login se carga
    await expect(page).toHaveURL(/\/admin\/login/);

    // Login inicial
    await page.getByLabel(/usuario/i).fill("admin");
    await page.getByLabel(/contraseña/i).fill("admin123");
    await page.getByRole("button", { name: /iniciar.+sesión/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

    const uniqueId = Date.now();
    const patientName = `Paciente Flow ${uniqueId}`;

    // 1. Registrar paciente nuevo
    const patientsLink = page
      .getByRole("link", { name: /historia|paciente/i })
      .first();
    await patientsLink.click();

    const newPatientButton = page.getByRole("button", {
      name: /nuevo.+paciente/i,
    });
    await newPatientButton.click();

    await page.getByLabel(/nombre/i).fill(patientName);
    await page.getByLabel(/apellido/i).fill("Test Flow");
    await page
      .getByLabel(/dni|documento/i)
      .fill(`${uniqueId.toString().slice(-8)}`);
    await page.getByLabel(/fecha.+nacimiento/i).fill("1990-06-15");

    const genderSelect = page.getByRole("radio", { name: /masculino|m/i });
    if (await genderSelect.isVisible()) {
      await genderSelect.click();
    }

    const savePatientButton = page.getByRole("button", {
      name: /guardar|registrar/i,
    });
    await savePatientButton.click();

    // Verificar creación del paciente
    await expect(page.getByText(patientName)).toBeVisible({ timeout: 5000 });

    // 2. Completar ficha odontológica
    const viewRecordLink = page
      .getByRole("link", { name: /ver.+ficha|ficha/i })
      .last();
    if (await viewRecordLink.isVisible()) {
      await viewRecordLink.click();
    }

    await page.waitForLoadState("networkidle");

    // 3. Crear historia clínica básica
    const historiaTab = page.getByRole("tab", {
      name: /historia|antecedentes/i,
    });
    if (await historiaTab.isVisible()) {
      await historiaTab.click();

      // Agregar algunos antecedentes básicos
      const allergiesSection = page.locator(':has-text("Alergias")');
      if (await allergiesSection.isVisible()) {
        const allergiesNo = allergiesSection.getByRole("radio", {
          name: /no/i,
        });
        if (await allergiesNo.isVisible()) {
          await allergiesNo.click();
        }
      }

      const saveHistoryButton = page.getByRole("button", { name: /guardar/i });
      if (await saveHistoryButton.isVisible()) {
        await saveHistoryButton.click();
        await expect(page.getByText(/guardado|éxito/i)).toBeVisible({
          timeout: 3000,
        });
      }
    }

    // 4. Realizar odontograma inicial
    const odontogramaTab = page.getByRole("tab", { name: /odontograma/i });
    if (await odontogramaTab.isVisible()) {
      await odontogramaTab.click();

      // Marcar un diente con caries
      const tooth = page.locator('[data-tooth="11"], .tooth-11').first();
      if (await tooth.isVisible()) {
        await tooth.click();

        const cariesButton = page.getByRole("button", { name: /caries/i });
        if (await cariesButton.isVisible()) {
          await cariesButton.click();
        }

        const saveOdontButton = page.getByRole("button", { name: /guardar/i });
        await saveOdontButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // 5. Crear caso clínico
    const casosTab = page.getByRole("tab", { name: /casos/i });
    if (await casosTab.isVisible()) {
      await casosTab.click();

      const newCaseButton = page.getByRole("button", { name: /nuevo.+caso/i });
      if (await newCaseButton.isVisible()) {
        await newCaseButton.click();

        const caseNameField = page.getByLabel(/nombre.+caso/i);
        const caseName = `Tratamiento Flow ${uniqueId}`;
        await caseNameField.fill(caseName);

        const saveCaseButton = page.getByRole("button", {
          name: /guardar|crear/i,
        });
        await saveCaseButton.click();

        await expect(page.getByText(/caso.+creado/i)).toBeVisible({
          timeout: 5000,
        });
      }
    }

    // 6. Agendar primera cita
    const citasLink = page.getByRole("link", { name: /citas|agenda/i });
    await citasLink.click();

    const newAppointmentButton = page.getByRole("button", {
      name: /nueva.+cita/i,
    });
    if (await newAppointmentButton.isVisible()) {
      await newAppointmentButton.click();

      // Seleccionar el paciente creado
      const patientSelect = page.locator(
        'select[name*="paciente"], #paciente_id'
      );
      const patientOption = patientSelect.locator(
        `option:has-text("${patientName}")`
      );
      if (await patientOption.isVisible()) {
        await patientSelect.selectOption(
          (await patientOption.getAttribute("value")) || ""
        );
      }

      // Configurar fecha futura
      const dateField = page.locator("#fecha_inicio");
      if (await dateField.isVisible()) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);
        await dateField.fill(
          futureDate.toISOString().slice(0, 16).replace("T", " ")
        );
      }

      const motiveField = page.locator("#motivo");
      if (await motiveField.isVisible()) {
        await motiveField.fill("Primera consulta - Evaluación inicial");
      }

      const saveAppointmentButton = page.getByRole("button", {
        name: /guardar.+cita/i,
      });
      await saveAppointmentButton.click();

      await expect(page.getByText(/cita.+registrada/i)).toBeVisible({
        timeout: 10000,
      });
    }

    console.log("Flujo completo ejecutado exitosamente");

    // Verificar datos consistentes en todo el flujo
    await expect(page.getByText(patientName)).toBeVisible();
  });
});
