import { gzipSync } from "node:zlib";

import { createAdminClient } from "@/lib/supabase/admin";

const BACKUP_TABLES = [
  "ajustes_aplicacion",
  "antecedentes",
  "casos_clinicos",
  "chatbot_contexto",
  "chatbot_faqs",
  "chatbot_rate_limit",
  "cie10_catalogo",
  "citas",
  "cms_carrusel",
  "cms_equipo",
  "cms_secciones",
  "cms_servicio_imagenes",
  "cms_servicios",
  "cms_tema",
  "codigos_invitacion",
  "config_seguridad",
  "consentimientos",
  "cuestionario_respuestas",
  "diagnosticos",
  "grupos_procedimiento",
  "historias_clinicas",
  "imagenes_pacientes",
  "monedas",
  "odontogramas",
  "pacientes",
  "pagos",
  "personal",
  "plan_items",
  "planes_procedimiento",
  "presupuesto_items",
  "presupuestos",
  "procedimiento_precios",
  "procedimientos",
  "recetas",
  "seguimiento_audit_log",
  "seguimiento_imagenes",
  "seguimientos",
  "unidades",
] as const;

const BACKUP_PAGE_SIZE = 100;
const MAX_BACKUP_CHUNK_BYTES = Number(process.env.DB_BACKUP_MAX_CHUNK_BYTES || 500_000);

type BackupResult = {
  bucket: string;
  bytes: number;
  generatedAt: string;
  path: string;
  tableCounts: Record<string, number>;
};

async function ensureBackupBucket(bucketName: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: false,
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }
}

async function fetchAllRows(table: string) {
  const supabase = createAdminClient();
  const pages: Record<string, unknown>[][] = [];
  let totalRows = 0;

  for (let from = 0; ; from += BACKUP_PAGE_SIZE) {
    const to = from + BACKUP_PAGE_SIZE - 1;
    const { data, error } = await supabase.from(table).select("*").range(from, to);

    if (error) {
      throw new Error(`No se pudo respaldar ${table}: ${error.message}`);
    }

    if (!data?.length) break;

    pages.push(data);
    totalRows += data.length;

    if (data.length < BACKUP_PAGE_SIZE) break;
  }

  return { pages, totalRows };
}

function splitRowsByCompressedSize(rows: Record<string, unknown>[]) {
  const groups: Record<string, unknown>[][] = [];
  let currentGroup: Record<string, unknown>[] = [];

  for (const row of rows) {
    const candidateGroup = [...currentGroup, row];
    const candidateSize = gzipSync(Buffer.from(JSON.stringify(candidateGroup))).byteLength;

    if (currentGroup.length > 0 && candidateSize > MAX_BACKUP_CHUNK_BYTES) {
      groups.push(currentGroup);
      currentGroup = [row];
      continue;
    }

    currentGroup = candidateGroup;
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

function getBackupBucketName() {
  return process.env.DB_BACKUP_BUCKET || "db-backups";
}

export async function runDatabaseBackup(): Promise<BackupResult> {
  const supabase = createAdminClient();
  const bucket = getBackupBucketName();
  const generatedAt = new Date().toISOString();
  const backupFolder = `automated/${generatedAt.slice(0, 10).replace(/-/g, "/")}/backup-${generatedAt.replace(/[.:]/g, "-")}`;
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0]
    : null;

  await ensureBackupBucket(bucket);

  const tableCounts: Record<string, number> = {};
  const tableChunks: Record<string, number> = {};
  let totalBytes = 0;

  for (const table of BACKUP_TABLES) {
    const { pages, totalRows } = await fetchAllRows(table);
    tableCounts[table] = totalRows;
    tableChunks[table] = 0;

    for (const page of pages) {
      const sizedChunks = splitRowsByCompressedSize(page);

      for (const rows of sizedChunks) {
        const compressedChunk = gzipSync(Buffer.from(JSON.stringify(rows)));
        if (compressedChunk.byteLength > MAX_BACKUP_CHUNK_BYTES) {
          throw new Error(
            `El backup de ${table} excede el tamaño máximo incluso con un chunk mínimo`
          );
        }

        tableChunks[table] += 1;
        const chunkPath = `${backupFolder}/tables/${table}.part-${String(tableChunks[table]).padStart(4, "0")}.json.gz`;
        totalBytes += compressedChunk.byteLength;

        const { error } = await supabase.storage.from(bucket).upload(chunkPath, compressedChunk, {
          contentType: "application/gzip",
          upsert: false,
        });

        if (error) {
          throw new Error(`No se pudo subir el backup de ${table}: ${error.message}`);
        }
      }
    }
  }

  const manifest = {
    backupFolder,
    generatedAt,
    projectRef,
    tableChunks,
    tableCounts,
    version: 1,
  };

  const filePath = `${backupFolder}/manifest.json.gz`;
  const compressed = gzipSync(Buffer.from(JSON.stringify(manifest)));
  totalBytes += compressed.byteLength;

  const { error } = await supabase.storage.from(bucket).upload(filePath, compressed, {
    contentType: "application/gzip",
    upsert: false,
  });

  if (error) {
    throw new Error(`No se pudo subir el backup: ${error.message}`);
  }

  return {
    bucket,
    bytes: totalBytes,
    generatedAt,
    path: filePath,
    tableCounts,
  };
}
