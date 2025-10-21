// Ejemplo de uso del sistema RAG
// Este archivo demuestra cómo funciona la búsqueda

import { searchFAQs, generateRAGContext, isRelevantForFAQ } from "./rag-utils";

// Ejemplo 1: Consulta sobre horarios
console.log("=== Ejemplo 1: Consulta sobre horarios ===");
const query1 = "¿A qué hora abren?";
console.log("Pregunta:", query1);
console.log("¿Es relevante para FAQ?:", isRelevantForFAQ(query1));

const results1 = searchFAQs(query1, 2);
console.log("\nFAQs encontradas:");
results1.forEach((faq, i) => {
  console.log(`\n${i + 1}. ${faq.question}`);
  console.log(`   ${faq.answer}`);
});

const context1 = generateRAGContext(results1);
console.log("\n--- Contexto RAG generado ---");
console.log(context1);

// Ejemplo 2: Consulta sobre precios
console.log("\n\n=== Ejemplo 2: Consulta sobre precios ===");
const query2 = "¿Cuánto cuesta una consulta?";
console.log("Pregunta:", query2);
console.log("¿Es relevante para FAQ?:", isRelevantForFAQ(query2));

const results2 = searchFAQs(query2, 2);
console.log("\nFAQs encontradas:");
results2.forEach((faq, i) => {
  console.log(`\n${i + 1}. ${faq.question}`);
  console.log(`   ${faq.answer}`);
});

// Ejemplo 3: Consulta no relacionada con FAQs
console.log("\n\n=== Ejemplo 3: Consulta general ===");
const query3 = "Cuéntame un chiste";
console.log("Pregunta:", query3);
console.log("¿Es relevante para FAQ?:", isRelevantForFAQ(query3));

const results3 = searchFAQs(query3, 2);
console.log(
  "FAQs encontradas:",
  results3.length === 0 ? "Ninguna" : results3.length
);

// Para ejecutar este ejemplo:
// 1. Descomenta la línea de exportación al final del archivo
// 2. Ejecuta: npx ts-node -r tsconfig-paths/register lib/rag-example.ts

// O simplemente copia y pega estas líneas en la consola del navegador
// después de importar las funciones necesarias
