/**
 * Captura el odontograma desde el DOM y lo convierte a base64
 * Intenta múltiples métodos para asegurar captura confiable
 */
export async function captureOdontogramaAsBase64(): Promise<string | null> {
  try {
    // Primero intenta usar html2canvas (método más confiable para componentes React)
    const result = await captureOdontogramaWithHtml2Canvas();
    if (result) {
      console.log("Odontograma capturado con html2canvas");
      return result;
    }

    // Si html2canvas no está disponible, intenta con canvas SVG
    console.warn("html2canvas no disponible, intentando con SVG...");
    return await captureOdontogramaViaSVG();
  } catch (error) {
    console.error("Error capturando odontograma:", error);
    return null;
  }
}

/**
 * Captura usando html2canvas (mejor para React)
 */
async function captureOdontogramaWithHtml2Canvas(): Promise<string | null> {
  try {
    let html2canvas;
    try {
      html2canvas = (await import('html2canvas')).default;
    } catch {
      return null;
    }
    
    // Busca el contenedor del odontograma - intenta múltiples selectores
    let odontoContainer = document.querySelector('[data-testid="odontograma-container"]');
    
    // Si no lo encuentra, intenta otros selectores
    if (!odontoContainer) {
      odontoContainer = document.querySelector('.odontograma-container');
    }
    
    // Si aún no lo encuentra, busca por clase o estructura
    if (!odontoContainer) {
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        if (div.textContent?.includes('Adulto') && div.textContent?.includes('Niño')) {
          odontoContainer = div.querySelector('[data-testid="odontograma-container"]') || 
                           div.closest('.overflow-x-auto')?.querySelector('.odontograma-container');
          if (odontoContainer) break;
        }
      }
    }
    
    if (!odontoContainer) {
      console.warn("Contenedor de odontograma no encontrado - selectores intentados");
      return null;
    }

    console.log("Capturando contenedor:", odontoContainer);
    
    const canvas = await html2canvas(odontoContainer as HTMLElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      useCORS: true,
      width: Math.min((odontoContainer as HTMLElement).scrollWidth, 1200),
      height: Math.min((odontoContainer as HTMLElement).scrollHeight, 800),
      ignoreElements: (element: Element) => {
        // Ignora botones y controles
        return element.tagName === 'BUTTON' || 
               element.className?.toString().includes('shadow-sm') ||
               element.className?.toString().includes('btn');
      }
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.warn("html2canvas falló:", error);
    return null;
  }
}

/**
 * Captura alternativa usando SVG (si lo hay)
 */
async function captureOdontogramaViaSVG(): Promise<string | null> {
  try {
    // Buscar el SVG del odontograma en el DOM
    const svgElement = document.querySelector('svg[data-testid="odontograma-svg"]');
    
    if (!svgElement) {
      console.warn("No se encontró SVG del odontograma");
      return null;
    }

    // Obtener dimensiones
    const viewBox = svgElement.getAttribute('viewBox');
    const width = parseInt(svgElement.getAttribute('width') || '800');
    const height = parseInt(svgElement.getAttribute('height') || '600');
    
    // Crear canvas con escala para mejor resolución
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("No se pudo obtener contexto del canvas");
      return null;
    }

    // Clonar el SVG para no modificar el original
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('width', String(width));
    svgClone.setAttribute('height', String(height));
    if (viewBox) svgClone.setAttribute('viewBox', viewBox);

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Crear imagen desde SVG
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = () => {
        ctx.scale(scale, scale);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        // Convertir canvas a base64 PNG
        const base64 = canvas.toDataURL('image/png');
        console.log("Odontograma capturado vía SVG exitosamente");
        resolve(base64);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.error("Error al cargar imagen del odontograma");
        resolve(null);
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error("Error capturando SVG del odontograma:", error);
    return null;
  }
}
