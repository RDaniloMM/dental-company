import { test, expect } from "@playwright/test";
import { login, navigateToNewPatient } from "../helpers/navigation";

test.describe("Gestión de Pacientes", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("Registro de nuevo paciente - datos básicos", async ({ page }) => {
    // Navegar a Historias Clínicas → Nuevo Paciente
    await navigateToNewPatient(page);

    // El formulario se presenta correctamente (Dialog abierto)
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Nombres *")).toBeVisible();

    // Completar campos obligatorios: nombres, apellidos, DNI, fecha nacimiento
    const uniqueId = Date.now();
    await page.getByLabel("Nombres *").fill(`Juan Test ${uniqueId}`);
    await page.getByLabel("Apellidos *").fill("Pérez Test");
    await page.getByLabel("DNI *").fill(uniqueId.toString().slice(-8));

    // Ingresar fecha de nacimiento
    await page.getByLabel("Fecha de Nacimiento").fill("1990-01-01");

    // Seleccionar género (Select de Radix - ya tiene M por defecto)
    // El select ya tiene "Masculino" seleccionado por defecto

    // Ingresar email único (campo obligatorio para evitar duplicados)
    await page.getByLabel("Email").fill(`test${uniqueId}@ejemplo.com`);

    // Elegir 'Registro Rápido'
    await page.getByRole("button", { name: "Registro Rápido" }).click();

    // Confirmar creación del paciente - esperar el toast de Sonner
    const successToast = page.getByText("Paciente registrado correctamente");
    await expect(successToast).toBeVisible({ timeout: 10000 });

    // Verificar que el dialog se cierra y el paciente aparece en la lista
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });

    // Verificar que aparece en la tabla de pacientes
    const patientInTable = page.getByRole("cell", {
      name: new RegExp(`Juan Test ${uniqueId}`, "i"),
    });
    await expect(patientInTable).toBeVisible({ timeout: 10000 });
  });
});
