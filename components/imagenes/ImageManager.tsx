'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Loader2 } from 'lucide-react';
import ImageCard from './ImageCard';
import ImageViewerModal from './ImageViewerModal';
import ImageUploadModal from './ImageUploadModal';

interface ImageManagerProps {
  pacienteId: string;
  casoId?: string;
}

interface ImagenPaciente {
  id: string;
  public_id: string;
  tipo: string;
  url: string;
  fecha_subida: string;
  descripcion?: string;
}

const imageTypes = ['todos', 'radiografia', 'odontograma', 'seguimiento', 'otro'];

export default function ImageManager({ pacienteId, casoId }: ImageManagerProps) {
  const [images, setImages] = useState<ImagenPaciente[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImagenPaciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('todos');

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isViewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagenPaciente | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = casoId 
        ? `/api/imagenes/paciente/${pacienteId}?casoId=${casoId}` 
        : `/api/imagenes/paciente/${pacienteId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar las imágenes.');
      const data = await response.json();
      setImages(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pacienteId, casoId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (filter === 'todos') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.tipo === filter));
    }
  }, [filter, images]);

  const handleImageClick = (image: ImagenPaciente) => {
    setSelectedImage(image);
    setViewerModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    try {
      const response = await fetch(`/api/imagenes/${selectedImage.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar la imagen.');
      
      setImages(images.filter(img => img.id !== selectedImage.id));
      setViewerModalOpen(false);
      setSelectedImage(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message); // O un toast de error
      } else {
        alert('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className="w-full max-w-none">
      <Card className="min-h-[calc(100vh-5rem)]">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Galería de Imágenes</h1>
            <div className="flex items-center gap-4">
              <Select onValueChange={setFilter} value={filter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  {imageTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setUploadModalOpen(true)} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Subir Imagen
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && <p className="text-center text-destructive">{error}</p>}

          {!isLoading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <ImageCard key={image.id} imageData={image} onClick={() => handleImageClick(image)} />
              ))}
            </div>
          )}
          
          {!isLoading && filteredImages.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>No hay imágenes para mostrar.</p>
              <p className="text-sm">Prueba a subir una nueva imagen o cambia el filtro.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={fetchImages}
        pacienteId={pacienteId}
        casoId={casoId} // Pasar casoId al modal de subida
      />

      <ImageViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
        onDelete={handleDelete}
        imageData={selectedImage}
      />
    </div>
  );
}
