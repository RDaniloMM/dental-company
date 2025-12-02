import { Page } from "@playwright/test";

/**
 * Abre el sidebar/menú en dispositivos móviles si es necesario
 * En desktop el sidebar ya está visible, en móvil hay que hacer clic en el botón hamburguesa
 */
export async function openSidebarIfMobile(page: Page): Promise<void> {
  // Detectar si estamos en vista móvil (sidebar oculto)
  const sidebarToggle = page
    .locator(
      'button[data-sidebar="trigger"], ' +
        '[data-testid="sidebar-toggle"], ' +
        "button:has(svg.lucide-panel-left), " +
        "button:has(svg.lucide-menu), " +
        '[aria-label*="menu"], ' +
        '[aria-label*="sidebar"]'
    )
    .first();

  // Si el botón de toggle existe y es visible, hacer clic para abrir el sidebar
  if (await sidebarToggle.isVisible({ timeout: 1000 }).catch(() => false)) {
    await sidebarToggle.click();
    // Esperar a que el sidebar se abra
    await page.waitForTimeout(300);
  }
}

/**
 * Navega a una sección del menú lateral, abriendo el sidebar en móvil si es necesario
 */
export async function navigateToSection(
  page: Page,
  linkPattern: RegExp
): Promise<void> {
  // Intentar abrir el sidebar si estamos en móvil
  await openSidebarIfMobile(page);

  // Buscar y hacer clic en el enlace
  const link = page.getByRole("link", { name: linkPattern }).first();
  await link.click();

  // Esperar a que la navegación se complete
  await page.waitForLoadState("networkidle");
}

/**
 * Login estándar para todos los tests
 */
export async function login(
  page: Page,
  username: string = "admin",
  password: string = "admin123"
): Promise<void> {
  await page.goto("https://dental-company-tacna.vercel.app/admin/login");
  await page.getByLabel(/usuario/i).fill(username);
  await page.getByLabel(/contraseña/i).fill(password);
  await page.getByRole("button", { name: /iniciar.+sesión/i }).click();
}

/**
 * Navega a la sección de Historias Clínicas y luego al botón de Nuevo Paciente
 */
export async function navigateToNewPatient(page: Page): Promise<void> {
  // Abrir sidebar en móvil si es necesario
  await openSidebarIfMobile(page);

  // Ir a Historias Clínicas - buscar el link por texto o por href
  const historiasLink = page.locator('a[href="/admin/pacientes"]').first();
  await historiasLink.click();
  await page.waitForLoadState("networkidle");

  // Buscar el botón "Nuevo Paciente" en la página
  const newPatientButton = page.getByRole("button", {
    name: /nuevo.+paciente|agregar.+paciente|\+\s*paciente/i,
  });
  await newPatientButton.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Navega a la lista de Historias Clínicas
 */
export async function navigateToPatientsList(page: Page): Promise<void> {
  // Abrir sidebar en móvil si es necesario
  await openSidebarIfMobile(page);

  // Ir a Historias Clínicas - buscar el link por href
  const historiasLink = page.locator('a[href="/admin/pacientes"]').first();
  await historiasLink.click();
  await page.waitForLoadState("networkidle");
}
