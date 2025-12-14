"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, RefreshCw, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TasaCambio {
  id: string;
  moneda_origen: string;
  moneda_destino: string;
  tasa: number;
  actualizado_at: string;
}

interface TasaCambioRow {
  id: string;
  tasa: number;
  actualizado_at: string;
  monedas_origen?: { codigo?: string } | { codigo?: string }[] | null;
  monedas_destino?: { codigo?: string } | { codigo?: string }[] | null;
}

export default function TasasCambioAdmin() {
  const supabase = createClient();
  const [tasas, setTasas] = useState<TasaCambio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [nuevoValor, setNuevoValor] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "error" | "success"; texto: string } | null>(null);

  useEffect(() => {
    cargarTasas();
  }, []);

  const cargarTasas = async () => {
    try {
      const { data } = await supabase
        .from("tasas_cambio")
        .select(`
          id,
          tasa,
          actualizado_at,
          monedas_origen:moneda_origen_id(codigo),
          monedas_destino:moneda_destino_id(codigo)
        `)
        .eq("monedas_destino.codigo", "PEN")
        .order("actualizado_at", { ascending: false });

      if (data) {
        setTasas(
          data.map((t: TasaCambioRow) => {
            const origenCodigo = Array.isArray(t.monedas_origen)
              ? t.monedas_origen[0]?.codigo
              : t.monedas_origen?.codigo;
            const destinoCodigo = Array.isArray(t.monedas_destino)
              ? t.monedas_destino[0]?.codigo
              : t.monedas_destino?.codigo;

            return {
              id: t.id,
              moneda_origen: origenCodigo || "UNKNOWN",
              moneda_destino: destinoCodigo || "PEN",
              tasa: Number(t.tasa),
              actualizado_at: t.actualizado_at,
            } satisfies TasaCambio;
          })
        );
      }
    } catch (error) {
      console.error("Error cargando tasas:", error);
      setMensaje({ tipo: "error", texto: "Error al cargar tasas de cambio" });
    } finally {
      setLoading(false);
    }
  };

  const guardarTasa = async (tasaId: string) => {
    if (!nuevoValor || nuevoValor <= 0) {
      setMensaje({ tipo: "error", texto: "Ingresa un valor válido" });
      return;
    }

    try {
      const { error } = await supabase
        .from("tasas_cambio")
        .update({ tasa: nuevoValor, actualizado_at: new Date().toISOString() })
        .eq("id", tasaId);

      if (error) throw error;

      setMensaje({ tipo: "success", texto: "Tasa actualizada correctamente" });
      setEditando(null);
      setNuevoValor(null);
      setTimeout(cargarTasas, 1000);
    } catch (error) {
      console.error("Error guardando tasa:", error);
      setMensaje({ tipo: "error", texto: "Error al guardar tasa" });
    }
  };

  if (loading) return <div>Cargando tasas de cambio...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Tasas de Cambio
          </CardTitle>
          <CardDescription>
            Gestiona las tasas de conversión de monedas a PEN
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mensaje && (
            <Alert className={mensaje.tipo === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className={mensaje.tipo === "error" ? "text-red-700" : "text-green-700"}>
                {mensaje.texto}
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Moneda</TableHead>
                  <TableHead>A PEN</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasas.map((tasa) => (
                  <TableRow key={tasa.id}>
                    <TableCell className="font-medium">
                      {tasa.moneda_origen} → {tasa.moneda_destino}
                    </TableCell>
                    <TableCell>
                      {editando === tasa.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={nuevoValor ?? tasa.tasa}
                          onChange={(e) => setNuevoValor(parseFloat(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        <span className="font-mono text-lg">{tasa.tasa.toFixed(4)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(tasa.actualizado_at).toLocaleDateString("es-PE")}
                    </TableCell>
                    <TableCell>
                      {editando === tasa.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => guardarTasa(tasa.id)}
                            className="gap-1"
                          >
                            <Save className="h-3 w-3" />
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditando(null);
                              setNuevoValor(null);
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditando(tasa.id);
                            setNuevoValor(tasa.tasa);
                          }}
                        >
                          Editar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>💡 Nota:</strong> Las tasas de cambio se utilizan automáticamente para convertir todos los pagos a PEN en los KPIs. Actualiza estas tasas regularmente para mantener reportes precisos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
