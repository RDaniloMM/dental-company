import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";
import { FormData, SeguimientoRow } from "@/lib/supabase/ficha";

// Extiende la interfaz de jsPDF para incluir la propiedad lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}

export const generateFichaPDF = (
  formData: FormData,
  fichaId?: string
): ArrayBuffer => {
  const doc: jsPDFWithAutoTable = new jsPDF();
  let finalY = 40; // Mantiene la posición Y del último elemento añadido

  // --- ESTILOS Y CONFIGURACIÓN ---
  const margin = 15;
  const titleFontSize = 18;
  const headerFontSize = 14;
  const textFontSize = 10;
  const smallFontSize = 8;

  // --- ENCABEZADO ---
  // Añade el logo en la esquina superior izquierda
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoImage = fs.readFileSync(logoPath);
  doc.addImage(logoImage, "PNG", margin, 10, 30, 15);

  doc.setFontSize(titleFontSize);
  doc.setFont("helvetica", "bold");
  doc.text("FICHA ODONTOLÓGICA", doc.internal.pageSize.width / 2, 20, {
    align: "center",
  });

  doc.setFontSize(textFontSize);
  doc.setFont("helvetica", "normal");
  doc.text(
    `ID Ficha: ${fichaId || "________________"}`,
    doc.internal.pageSize.width - margin,
    20,
    { align: "right" }
  );
  doc.text(
    `Fecha de Emisión: ${new Date().toLocaleDateString("es-ES")}`,
    doc.internal.pageSize.width - margin,
    25,
    { align: "right" }
  );

  // --- FUNCIÓN AUXILIAR PARA AÑADIR SECCIONES ---
  const addSection = (
    title: string,
    body: (string | number)[][],
    startY: number
  ) => {
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, startY);

    autoTable(doc, {
      body: body,
      startY: startY + 5,
      theme: "plain",
      styles: {
        fontSize: textFontSize,
        cellPadding: 1.5,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: "auto" },
      },
      margin: { left: margin, right: margin },
    });

    if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
      finalY = doc.lastAutoTable.finalY + 10;
    }
  };

  // --- 1. FILIACIÓN ---
  const filiacionData = [
    [
      "Nombres y Apellidos",
      `${formData.filiacion.nombres} ${formData.filiacion.apellidos}`,
    ],
    ["Fecha de Nacimiento", formData.filiacion.fecha_nacimiento],
    ["Ocupación", formData.filiacion.ocupacion],
    ["Teléfono", formData.filiacion.telefono],
    ["Email", formData.filiacion.email],
    ["Alerta Médica", formData.filiacion.alerta_medica || "Ninguna"],
  ];
  addSection("1. Filiación del Paciente", filiacionData, finalY);

  // --- 2. ANTECEDENTES PATOLÓGICOS ---
  doc.setFontSize(headerFontSize);
  doc.setFont("helvetica", "bold");
  doc.text("2. Antecedentes Patológicos", margin, finalY);
  finalY += 7;

  const antecedentesBody = [];
  for (const [key, value] of Object.entries(formData.antecedentes)) {
    const titulo =
      key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

    // Aseguramos el tipo de 'value' para que TypeScript no lo infiera como 'unknown'
    const seccion = value as {
      no_refiere: boolean;
      [key: string]: boolean | string | { [key: string]: boolean };
    };

    if (seccion.no_refiere) {
      antecedentesBody.push([titulo, "No Refiere"]);
    } else {
      const detalles = Object.entries(seccion)
        .filter(([subKey, subValue]) => subKey !== "no_refiere" && subValue)
        .map(([subKey, subValue]) => {
          if (typeof subValue === "boolean") return subKey.replace(/_/g, " ");
          if (typeof subValue === "string" && subValue)
            return `${subKey.replace(/_/g, " ")}: ${subValue}`;
          // Manejo de objetos anidados como 'anticoagulantes_cuales'
          if (typeof subValue === "object" && subValue !== null) {
            const nestedDetails = Object.entries(subValue)
              .filter(([, v]) => v)
              .map(([k]) => k)
              .join(", ");
            if (nestedDetails)
              return `${subKey.replace(/_/g, " ")}: ${nestedDetails}`;
          }
          return null;
        })
        .filter(Boolean)
        .join("\n"); // Cambia el separador a salto de línea

      antecedentesBody.push([titulo, detalles || "Sin hallazgos positivos"]);
    }
  }

  autoTable(doc, {
    head: [["Categoría", "Detalles"]],
    body: antecedentesBody,
    startY: finalY,
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 20,
      fontStyle: "bold",
    },
    styles: { fontSize: smallFontSize },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
      1: { cellWidth: "auto" },
    },
    margin: { left: margin, right: margin },
  });
  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    finalY = doc.lastAutoTable.finalY + 10;
  }

  // --- 3. HÁBITOS ---
  const habitosData = [
    [
      "Tabaco",
      `${formData.habitos.tabaco} ${
        formData.habitos.tabaco_actual_detalle
          ? `(${formData.habitos.tabaco_actual_detalle})`
          : ""
      }`,
    ],
    [
      "Alcohol",
      `${formData.habitos.alcohol} ${
        formData.habitos.alcohol_frecuente_detalle
          ? `(${formData.habitos.alcohol_frecuente_detalle})`
          : ""
      }`,
    ],
    [
      "Drogas Recreacionales",
      formData.habitos.drogas_recreacionales
        ? `Sí (${formData.habitos.drogas_tipo})`
        : "No",
    ],
  ];
  addSection("3. Hábitos", habitosData, finalY);

  // --- 4. EXAMEN CLÍNICO ---
  const examenData = [
    ["Talla (m)", formData.examen_clinico.talla],
    ["Peso (kg)", formData.examen_clinico.peso],
    ["IMC", formData.examen_clinico.imc],
    ["Presión Arterial", formData.examen_clinico.pa],
  ];
  addSection("4. Examen Clínico", examenData, finalY);

  // --- 5. SEGUIMIENTO ---
  if (formData.seguimiento.length > 0) {
    doc.addPage(); // Nueva página para el seguimiento para asegurar espacio
    finalY = 30;
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("5. Seguimiento", margin, finalY);
    finalY += 7;

    const seguimientoHead = [
      ["Fecha", "Procedimiento Realizado", "Observaciones", "Próxima Cita"],
    ];
    const seguimientoBody = formData.seguimiento.map((row: SeguimientoRow) => [
      row.fecha,
      row.procedimiento_realizado,
      row.observaciones,
      row.proxima_cita,
    ]);

    autoTable(doc, {
      head: seguimientoHead,
      body: seguimientoBody,
      startY: finalY,
      theme: "grid",
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 20,
        fontStyle: "bold",
      },
      styles: { fontSize: smallFontSize },
      margin: { left: margin, right: margin },
    });
    if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
      finalY = doc.lastAutoTable.finalY + 10;
    }
  }

  // --- DEVOLVER EL DOCUMENTO COMO BUFFER ---
  return doc.output("arraybuffer");
};
