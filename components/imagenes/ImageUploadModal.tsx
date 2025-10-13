'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  pacienteId: string;
}

const imageTypes = ['radiografia', 'odontograma', 'seguimiento', 'otro'];

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  pacienteId,
}: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setError('El archivo debe ser una imagen de menos de 5 MB.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setTipo('');
    setDescripcion('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!file || !tipo || !pacienteId) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('paciente_id', pacienteId);
    formData.append('tipo', tipo);
    formData.append('descripcion', descripcion);

    try {
      const response = await fetch('/api/imagenes/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen.');
      }

      onUploadSuccess();
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir Nueva Imagen</DialogTitle>
          <DialogDescription>
            Selecciona una imagen para subir al perfil del paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`relative p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
            ${isDragActive ? 'border-primary' : 'border-border'}
            hover:border-primary/70 transition-colors`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <>
                <Image src={preview} alt="Vista previa" width={200} height={200} className="mx-auto h-32 w-auto object-contain" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-background rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra y suelta una imagen, o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-muted-foreground/80">Tamaño máximo: 5 MB</p>
              </div>
            )}
          </div>

          <Select onValueChange={setTipo} value={tipo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo de imagen" />
            </SelectTrigger>
            <SelectContent>
              {imageTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Notas o descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!file || !tipo || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
