import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import fs from "fs";
import path from "path";
import type {
  FichaPDFPayload,
  PresupuestoPDFPayload,
  AntecedentesAnnotation,
  OdontogramaData,
  Seguimiento,
  PresupuestoItem,
  PagoItem,
  TableBody,
} from "@/lib/types/pdf";

// Extiende la interfaz de jsPDF para incluir la propiedad lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}

// Colores profesionales para consultorio odontológico
const COLORS = {
  primary: [41, 128, 185] as [number, number, number], // Azul dental profesional
  accent: [52, 152, 219] as [number, number, number], // Azul claro
  success: [39, 174, 96] as [number, number, number], // Verde éxito
  warning: [230, 126, 34] as [number, number, number], // Naranja alerta
  danger: [231, 76, 60] as [number, number, number], // Rojo alerta
  emerald: [46, 204, 113] as [number, number, number], // Verde esmeralda para anotaciones
  text: [44, 62, 80] as [number, number, number], // Gris oscuro
  textLight: [127, 140, 141] as [number, number, number], // Gris claro
  border: [236, 240, 241] as [number, number, number], // Gris muy claro
  bgAlt: [245, 248, 250] as [number, number, number], // Fondo alternativo
};

// ==================== FICHA ODONTOLÓGICA ====================
export const generateFichaPDF = (payload: FichaPDFPayload): ArrayBuffer => {
  // Validar datos mínimos
  if (!payload.numero_historia) {
    throw new Error("numero_historia es requerido para generar la ficha");
  }

  const doc: jsPDFWithAutoTable = new jsPDF();
  let finalY = 48;

  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;

  // --- ENCABEZADO PROFESIONAL ---
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoImage = fs.readFileSync(logoPath);
      doc.addImage(logoImage, "PNG", margin, 10, 30, 15);
    }
  } catch (e) {
    console.warn("Logo no encontrado");
  }

  // Barra decorativa superior
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FICHA ODONTOLÓGICA", pageWidth / 2, 18, { align: "center" });

  const numeroHistoria = payload.numero_historia || "";
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`Nº Historia: ${numeroHistoria}`, pageWidth / 2, 32, {
    align: "center",
  });

  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  // --- 1. FILIACIÓN ---
  finalY = 42;
  drawSectionHeader(doc, margin, finalY, "1. FILIACIÓN");
  finalY += 8;

  const filiacion = payload.filiacion || {};
  const edad = filiacion.fecha_nacimiento
    ? calcularEdad(filiacion.fecha_nacimiento)
    : "";
  const sexo =
    filiacion.sexo === "masculino"
      ? "Masculino"
      : filiacion.sexo === "femenino"
        ? "Femenino"
        : "";

  const filiacionData = [
    [
      {
        content: "Nombres: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      {
        content:
          filiacion.nombres && filiacion.apellidos
            ? `${filiacion.nombres} ${filiacion.apellidos}`
            : filiacion.nombres || "",
        colSpan: 2,
      },
      {
        content: "Edad: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      edad || "",
      {
        content: "Sexo: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      sexo || "",
    ],
    [
      {
        content: "Dirección: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.direccion || "", colSpan: 2 },
      {
        content: "Est. civil: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      filiacion.estado_civil || "",
      { content: "", colSpan: 1 },
    ],
    [
      {
        content: "Ocupación: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.ocupacion || "", colSpan: 2 },
      {
        content: "Teléfono: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.telefono || "", colSpan: 2 },
    ],
    [
      {
        content: "País/Dpto.: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.lugar_procedencia || "", colSpan: 2 },
      {
        content: "F. Nac.: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.fecha_nacimiento || "", colSpan: 2 },
    ],
    [
      {
        content: "Recomendado por: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.recomendado_por || "", colSpan: 2 },
      {
        content: "Email: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: filiacion.email || "", colSpan: 2 },
    ],
    [
      {
        content: "Fecha: ",
        styles: { fontStyle: "bold", fontSize: 8, textColor: COLORS.primary },
      },
      { content: new Date().toLocaleDateString("es-ES"), colSpan: 5 },
    ],
  ];

  autoTable(doc, {
    body: filiacionData as RowInput[],
    startY: finalY,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5, textColor: COLORS.text },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 35 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 18 },
      5: { cellWidth: 25 }, // Más ancho para "Femenino"
    },
    margin: { left: margin, right: margin },
  });
  finalY = doc.lastAutoTable?.finalY || finalY + 10;
  finalY += 12; // Dos saltos de línea entre secciones

  // --- 2. ANTECEDENTES PATOLÓGICOS ---
  drawSectionHeader(doc, margin, finalY, "2. ANTECEDENTES PATOLÓGICOS");
  finalY += 8;

  const antecedentes = payload.antecedentes || {};
  const antecedentesBody: Record<string, unknown>[] = [];

  const ordenCategorias = [
    "cardiovascular",
    "respiratorio",
    "endocrino_metabolico",
    "neurologico_psiquiatrico",
    "hematologia_inmunologico",
    "digestivo_hepatico",
    "renal",
    "alergias",
    "habitos",
    "otros_relevantes",
  ];

  const displayCategorias: Record<string, string> = {
    cardiovascular: "Cardiovascular",
    respiratorio: "Respiratorio",
    endocrino_metabolico: "Endocrino-Metabólico",
    neurologico_psiquiatrico: "Neurológico/Psiquiátrico",
    hematologia_inmunologico: "Hematología/Inmunológico",
    digestivo_hepatico: "Digestivo/Hepático",
    renal: "Renal",
    alergias: "Alergias",
    habitos: "Hábitos",
    otros_relevantes: "Otros relevantes",
  };

  const antecedentesMap = new Map<string, Record<string, unknown>>();
  Object.entries(antecedentes).forEach(
    ([categoria, datos]: [string, unknown]) => {
      antecedentesMap.set(
        normalizeKey(categoria),
        datos as Record<string, unknown>,
      );
    },
  );

  ordenCategorias.forEach((catKey) => {
    const datos = antecedentesMap.get(catKey);
    if (!datos) return;

    const titulo = displayCategorias[catKey] || formatearTitulo(catKey);

    if (datos.no_refiere) {
      antecedentesBody.push([
        {
          content: titulo,
          styles: { fontStyle: "bold" as const, textColor: COLORS.primary },
        },
        {
          content: "No refiere",
          styles: { textColor: COLORS.textLight, italic: true },
        },
      ] as unknown as Record<string, unknown>);
      return;
    }

    const detalles: string[] = [];
    const questions =
      datos.questions && typeof datos.questions === "object"
        ? datos.questions
        : datos;

    Object.entries(questions).forEach(([campo, valor]) => {
      if (
        campo === "no_refiere" ||
        campo === "annotations" ||
        campo === "annotationsEnabled"
      )
        return;
      if (valor === null || valor === undefined || valor === false) return;

      const etiqueta = formatearCampo(campo);

      if (typeof valor === "boolean") {
        if (valor) detalles.push(`• ${etiqueta}`);
      } else if (typeof valor === "string") {
        if (valor.trim()) detalles.push(`• ${etiqueta}: ${valor.trim()}`);
      } else if (typeof valor === "object") {
        const valueObj = valor as Record<string, unknown>;
        const respuesta = valueObj.respuesta as boolean | undefined;
        const texto =
          (valueObj.texto as string) || (valueObj.detalle as string) || "";
        if (respuesta === false && !texto) return;
        if (texto) {
          detalles.push(`• ${etiqueta}: ${texto}`);
        } else if (respuesta !== false) {
          detalles.push(`• ${etiqueta}`);
        }
      }
    });

    // Extraer anotaciones separadas
    const dataObj = datos as Record<string, unknown>;
    const anotEnabled = dataObj.annotationsEnabled as boolean | undefined;
    const anotaciones = Array.isArray(dataObj.annotations)
      ? (dataObj.annotations as AntecedentesAnnotation[])
      : [];
    const anotacionesLimpias =
      anotEnabled && anotaciones.length > 0
        ? anotaciones
            .map((a: AntecedentesAnnotation) => {
              // Combinar selection y detail: "Hipertensión: xxx"
              const selection = (a.selection || "").trim();
              const detail = (a.detail || "").trim();

              if (!selection && !detail) return "";
              if (selection && detail) return `${selection}: ${detail}`;
              return selection || detail;
            })
            .filter(Boolean)
        : [];

    if (detalles.length > 0 || anotacionesLimpias.length > 0) {
      // Fila única: categoría | checklist | anotaciones
      const anotacionesTotales =
        anotacionesLimpias.length > 0
          ? anotacionesLimpias.map((a) => `• ${a}`).join("\n")
          : "";

      antecedentesBody.push([
        {
          content: titulo,
          styles: { fontStyle: "bold" as const, textColor: COLORS.primary },
        },
        {
          content: detalles.join("\n"),
          styles: { textColor: COLORS.text },
        },
        {
          content: anotacionesTotales,
          styles: { textColor: COLORS.emerald, italic: true, fontSize: 7 },
        },
      ] as unknown as Record<string, unknown>);
    }
  });

  if (antecedentesBody.length > 0) {
    autoTable(doc, {
      body: antecedentesBody as RowInput[],
      startY: finalY,
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 2, textColor: COLORS.text },
      headStyles: {
        fillColor: COLORS.bgAlt,
        textColor: COLORS.primary,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 35, fillColor: COLORS.bgAlt },
        1: { cellWidth: 55 },
        2: { cellWidth: 45 },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      margin: { left: margin, right: margin },
    });
    finalY = doc.lastAutoTable?.finalY || finalY + 10;
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.textLight[0],
      COLORS.textLight[1],
      COLORS.textLight[2],
    );
    doc.text("Sin antecedentes patológicos registrados", margin, finalY);
    finalY += 10;
  }

  finalY += 12; // Dos saltos de línea entre secciones

  // --- 3. EXAMEN CLÍNICO - ODONTOGRAMA (en página nueva) ---
  doc.addPage();
  finalY = 20;

  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  drawSectionHeader(doc, margin, finalY, "3. EXAMEN CLÍNICO - ODONTOGRAMA");
  finalY += 8;

  const odontograma =
    (payload.odontograma as OdontogramaData | undefined) || {};
  // Validar que existe y tiene versión válida (puede ser 0, así que verificamos !== undefined)
  const odontoData = odontograma as OdontogramaData;
  const tieneOdontograma =
    odontoData.existe &&
    odontoData.version !== undefined &&
    odontoData.version !== null;

  if (tieneOdontograma) {
    const odontoImg: string | undefined =
      odontoData.imagen_base64 ||
      ((odontograma as unknown as Record<string, unknown>)
        .imagen_url as string);

    if (odontoImg) {
      try {
        const imgFormat = odontoImg.startsWith("data:image/png")
          ? "PNG"
          : "JPEG";
        const availableWidth = pageWidth - margin * 2;
        const targetHeight = 100;

        // Bordes redondeados simulados con rectángulo de fondo
        doc.setFillColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
        doc.rect(margin, finalY - 1, availableWidth, targetHeight + 2, "F");

        doc.addImage(
          odontoImg,
          imgFormat as "PNG" | "JPEG" | "JPG" | "GIF",
          margin + 1,
          finalY,
          availableWidth - 2,
          targetHeight,
        );
        finalY += targetHeight + 6;
      } catch (e) {
        // Placeholder visible si la imagen falla
        const availableWidth = pageWidth - margin * 2;
        const targetHeight = 60;
        doc.setDrawColor(
          COLORS.warning[0],
          COLORS.warning[1],
          COLORS.warning[2],
        );
        doc.setLineWidth(0.4);
        doc.rect(margin, finalY, availableWidth, targetHeight);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(
          COLORS.warning[0],
          COLORS.warning[1],
          COLORS.warning[2],
        );
        doc.text(
          "Odontograma no disponible (error al renderizar)",
          margin + 4,
          finalY + 12,
        );
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(
          COLORS.textLight[0],
          COLORS.textLight[1],
          COLORS.textLight[2],
        );
        doc.text(
          "Revisa que el odontograma esté visible antes de generar el PDF.",
          margin + 4,
          finalY + 22,
        );
        finalY += targetHeight + 6;
      }
    } else {
      // No hay imagen disponible: mostrar placeholder
      const availableWidth = pageWidth - margin * 2;
      const targetHeight = 60;
      doc.setDrawColor(
        COLORS.textLight[0],
        COLORS.textLight[1],
        COLORS.textLight[2],
      );
      doc.setLineWidth(0.3);
      doc.rect(margin, finalY, availableWidth, targetHeight);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        COLORS.textLight[0],
        COLORS.textLight[1],
        COLORS.textLight[2],
      );
      doc.text("Odontograma no disponible", margin + 4, finalY + 12);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(
        "No se capturó imagen. Asegúrate de que el odontograma esté visible antes de generar el reporte.",
        margin + 4,
        finalY + 22,
      );
      finalY += targetHeight + 6;
    }

    // Formatear versión y fecha de forma segura
    const versionStr =
      odontoData.version !== undefined ? `v${odontoData.version}` : "N/A";
    const fechaStr = odontoData.fecha_registro || "Sin fecha";

    const odontogramaDetalles = [
      [
        {
          content: "Versión",
          styles: { fontStyle: "bold", textColor: COLORS.primary },
        },
        versionStr,
        {
          content: "Fecha",
          styles: { fontStyle: "bold", textColor: COLORS.primary },
        },
        fechaStr,
      ],
      [
        {
          content: "Observaciones",
          styles: { fontStyle: "bold", textColor: COLORS.primary },
        },
        {
          content: odontoData.observaciones || "Sin observaciones",
          colSpan: 3,
          styles: { textColor: COLORS.text },
        },
      ],
    ];

    autoTable(doc, {
      body: odontogramaDetalles as RowInput[],
      startY: finalY,
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 2, textColor: COLORS.text },
      columnStyles: {
        0: { cellWidth: 30, fillColor: COLORS.bgAlt },
        1: { cellWidth: 55 },
        2: { cellWidth: 25, fillColor: COLORS.bgAlt },
        3: { cellWidth: "auto" },
      },
      margin: { left: margin, right: margin },
    });
    finalY = doc.lastAutoTable?.finalY || finalY + 8;
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.textLight[0],
      COLORS.textLight[1],
      COLORS.textLight[2],
    );
    doc.text("Sin odontograma registrado", margin, finalY);
    finalY += 10;
  }

  finalY += 18; // Mayor espaciado para evitar cortes de imagen y número de página

  // --- 4. SEGUIMIENTO ---
  if (finalY > 200) {
    doc.addPage();
    finalY = 20;
  }

  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  drawSectionHeader(doc, margin, finalY, "4. SEGUIMIENTO");
  finalY += 8;

  const seguimientos = payload.seguimientos || [];
  if (seguimientos.length > 0) {
    const seguimientoHead = [
      ["Fecha", "Tratamientos Realizados", "Observaciones"],
    ];
    const seguimientoBody = seguimientos.map((seg: Seguimiento) => [
      seg.fecha || "",
      seg.tratamientos && seg.tratamientos.length > 0
        ? seg.tratamientos.join("\n")
        : "-----",
      "",
    ]);

    autoTable(doc, {
      head: seguimientoHead,
      body: seguimientoBody,
      startY: finalY,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7.5,
        halign: "center",
      },
      styles: { fontSize: 7, cellPadding: 2, textColor: COLORS.text },
      alternateRowStyles: { fillColor: COLORS.bgAlt },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 100 },
        2: { cellWidth: 45 },
      },
      tableWidth: pageWidth - margin * 2,
      margin: { left: margin, right: margin },
    });
  } else {
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.textLight[0],
      COLORS.textLight[1],
      COLORS.textLight[2],
    );
    doc.text("Sin seguimientos registrados", margin, finalY);
  }

  // --- PIE DE PÁGINA ---
  const pageCount = (
    doc as unknown as { getNumberOfPages(): number }
  ).getNumberOfPages();
  const pageHeight = doc.internal.pageSize.height;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(
      COLORS.textLight[0],
      COLORS.textLight[1],
      COLORS.textLight[2],
    );

    // Línea separadora (más abajo para no interferir)
    doc.setLineWidth(0.1);
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Número de página
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 8, {
      align: "center",
    });
  }

  return doc.output("arraybuffer");
};

// ==================== PRESUPUESTO ====================
export const generatePresupuestoPDF = (
  payload: PresupuestoPDFPayload,
): ArrayBuffer => {
  const doc: jsPDFWithAutoTable = new jsPDF();
  let finalY = 40;

  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;

  // --- ENCABEZADO ---
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoImage = fs.readFileSync(logoPath);
      doc.addImage(logoImage, "PNG", margin, 10, 30, 15);
    }
  } catch (e) {
    console.warn("Logo no encontrado");
  }

  // Barra decorativa
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, pageWidth, 42, "F");

  const fechaPresupuesto =
    payload.fecha_presupuesto || new Date().toLocaleDateString("es-ES");
  const numeroHistoria = payload.numero_historia || "";
  const correlativo = payload.correlativo
    ? String(payload.correlativo).padStart(3, "0")
    : "---";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`Presupuesto #${correlativo}`, pageWidth / 2, 18, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Fecha: ${fechaPresupuesto}`, pageWidth / 2, 28, {
    align: "center",
  });
  doc.text(`Nº Historia: ${numeroHistoria}`, pageWidth / 2, 36, {
    align: "center",
  });

  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  // --- TABLA DE PROCEDIMIENTOS ---
  finalY = 52;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Nombre: ${payload.paciente_nombre || ""}`, margin, finalY - 2);
  finalY += 8; // dos saltos ligeros antes de la tabla
  drawSectionHeader(doc, margin, finalY, "1. Tabla de Procedimientos");
  finalY += 8;
  const items = payload.items || [];
  const monedaSimbolo = payload.moneda_simbolo || "S/";

  if (items.length > 0) {
    const itemsHead = [
      ["#", "Tratamiento", "Descripción", "Cantidad", "P. Unit.", "Sub total"],
    ];
    let totalPresupuesto = 0;

    const itemsBody = items.map((item: PresupuestoItem, idx: number) => {
      const subtotal = (item.cantidad || 1) * (item.costo || 0);
      totalPresupuesto += subtotal;
      return [
        (idx + 1).toString(),
        item.nombre || "",
        item.descripcion || item.notas || "",
        (item.cantidad || 1).toString(),
        `${monedaSimbolo} ${(item.costo || 0).toFixed(2)}`,
        `${monedaSimbolo} ${subtotal.toFixed(2)}`,
      ];
    });

    itemsBody.push([
      {
        content: "PRESUPUESTO TOTAL",
        colSpan: 5,
        styles: {
          fontStyle: "bold" as const,
          halign: "right" as const,
          textColor: [255, 255, 255],
          fillColor: COLORS.success,
        },
      } as unknown as string,
      {
        content: `${monedaSimbolo} ${totalPresupuesto.toFixed(2)}`,
        styles: {
          fontStyle: "bold" as const,
          textColor: [255, 255, 255],
          fillColor: COLORS.success,
        },
      } as unknown as string,
    ]);

    autoTable(doc, {
      head: itemsHead,
      body: itemsBody,
      startY: finalY,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
      alternateRowStyles: { fillColor: COLORS.bgAlt },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 48 },
        2: { cellWidth: 55 },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 22, halign: "right" },
        5: { cellWidth: 23, halign: "right" },
      },
      tableWidth: pageWidth - margin * 2,
      margin: { left: margin, right: margin },
    });
    finalY = doc.lastAutoTable?.finalY || finalY + 10;
  }

  // Dos saltos de línea antes de pagos
  finalY += 12;

  // --- TABLA DE PAGOS ---
  drawSectionHeader(doc, margin, finalY, "2. Pagos realizados");
  finalY += 8;

  const pagos = payload.pagos || [];
  if (pagos.length > 0) {
    const pagosHead = [["Fecha", "Tratamiento", "Pago realizado", "Otros"]];
    const pagosBody = pagos.map((pago: PagoItem) => [
      pago.fecha || "",
      pago.tratamientos ? pago.tratamientos.join("\n") : "",
      `${monedaSimbolo} ${(pago.monto || 0).toFixed(2)}`,
      "",
    ]);

    autoTable(doc, {
      head: pagosHead,
      body: pagosBody,
      startY: finalY,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      styles: { fontSize: 8, cellPadding: 3, textColor: COLORS.text },
      alternateRowStyles: { fillColor: COLORS.bgAlt },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 75 },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35 },
      },
      tableWidth: pageWidth - margin * 2,
      margin: { left: margin, right: margin },
    });
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.textLight[0],
      COLORS.textLight[1],
      COLORS.textLight[2],
    );
    doc.text("Sin pagos registrados", margin, finalY);
  }

  return doc.output("arraybuffer");
};

// ==================== FUNCIONES AUXILIARES ====================
function drawSectionHeader(
  doc: jsPDFWithAutoTable,
  x: number,
  y: number,
  title: string,
) {
  doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.rect(x - 2, y - 3, 3, 8, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(title, x + 3, y + 1);

  // Línea divisoria sutil
  doc.setLineWidth(0.1);
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.line(x, y + 5, doc.internal.pageSize.width - x, y + 5);
}

function calcularEdad(fechaNacimiento: string): string {
  if (!fechaNacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return `${edad} años`;
}

function normalizeKey(categoria: string): string {
  return categoria
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s/\-]+/g, "_");
}

function formatearTitulo(sistema: string): string {
  return sistema
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatearCampo(campo: string): string {
  return campo
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
