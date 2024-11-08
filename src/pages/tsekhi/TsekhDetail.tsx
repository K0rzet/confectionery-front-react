import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { tsekhService } from '@/services/tsekh.service';
import { TipMarkera, Marker } from '@/types/tsekh.types';
import { MarkerIcons } from '@/components/icons/MarkerIcons';
import styles from './TsekhDetail.module.scss';
import cn from 'classnames';

export function TsekhDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [planRotation, setPlanRotation] = useState(0);
  const [markerRotation, setMarkerRotation] = useState<number>(0);
  const popupRef = useRef<HTMLDivElement>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; tip: TipMarkera | null }>({
    x: 0,
    y: 0,
    tip: null
  });

  const { data: tsekh, isLoading } = useQuery({
    queryKey: ['tsekh', id],
    queryFn: () => tsekhService.poluchitTsekhSMarkerami(Number(id))
  });

  const dobavitMarkerMutation = useMutation({
    mutationFn: (data: { tip: TipMarkera; x: number; y: number; povorot: number }) =>
      tsekhService.dobavitMarker(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tsekh', id] });
    }
  });

  const obnovitMarkerMutation = useMutation({
    mutationFn: (data: { markerId: number; x: number; y: number; povorot: number }) =>
      tsekhService.obnovitMarker(Number(id), data.markerId, {
        x: data.x,
        y: data.y,
        povorot: data.povorot
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tsekh', id] });
    }
  });

  const udalitMarkerMutation = useMutation({
    mutationFn: (markerId: number) =>
      tsekhService.udalitMarker(Number(id), markerId),
    onSuccess: () => {
      setSelectedMarker(null);
      queryClient.invalidateQueries({ queryKey: ['tsekh', id] });
    }
  });

  const handleDragStart = (e: React.DragEvent, tip: TipMarkera) => {
    e.dataTransfer.setData('text/plain', tip);
    setDragPreview(prev => ({ ...prev, tip }));
  };

  const calculateCoordinates = (
    clientX: number, 
    clientY: number, 
    rect: DOMRect, 
    rotation: number
  ) => {
    // Находим центр изображения
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Координаты клика относительно центра
    const relativeX = clientX - centerX;
    const relativeY = clientY - centerY;

    // Конвертируем угол в радианы
    const angle = (rotation * Math.PI) / 180;

    // Применяем обратное вращение
    const rotatedX = relativeX * Math.cos(-angle) - relativeY * Math.sin(-angle);
    const rotatedY = relativeX * Math.sin(-angle) + relativeY * Math.cos(-angle);

    // Возвращаем к координатам относительно левого верхнего угла и переводим в проценты
    const percentX = ((rotatedX + rect.width / 2) / rect.width) * 100;
    const percentY = ((rotatedY + rect.height / 2) / rect.height) * 100;

    return {
      x: Math.min(Math.max(0, percentX), 100),
      y: Math.min(Math.max(0, percentY), 100)
    };
  };

  const handleDragOver = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const { x, y } = calculateCoordinates(e.clientX, e.clientY, rect, planRotation);
    
    setDragPreview({ x, y, tip: dragPreview.tip });
  };

  const handleDrop = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
    const markerType = e.dataTransfer.getData('text/plain') as TipMarkera;
    
    if (markerType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const { x, y } = calculateCoordinates(e.clientX, e.clientY, rect, planRotation);

      dobavitMarkerMutation.mutate({
        tip: markerType,
        x,
        y,
        povorot: 0
      });
    }
    
    setDragPreview({ x: 0, y: 0, tip: null });
  };

  const handleDragLeave = () => {
    setDragPreview(prev => ({ ...prev, tip: null }));
  };

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
    setMarkerRotation(marker.povorot);
  };

  const handleRotationChange = (newRotation: number) => {
    if (selectedMarker) {
      setMarkerRotation(newRotation);
      obnovitMarkerMutation.mutate({
        markerId: selectedMarker.id,
        x: selectedMarker.x,
        y: selectedMarker.y,
        povorot: newRotation
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(`.${styles.marker}`)
      ) {
        setSelectedMarker(null);
        setMarkerRotation(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.rotationSlider}>
          <span>Поворот:</span>
          <input
            type="range"
            min="-360"
            max="360"
            value={planRotation}
            onChange={(e) => setPlanRotation(Number(e.target.value))}
          />
          <span>{planRotation}°</span>
        </div>
      </div>

      <div className={styles.toolbox}>
        <h3>Маркеры</h3>
        <div className={styles.markerTools}>
          {Object.entries(MarkerIcons).map(([tip, Icon]) => (
            <div
              key={tip}
              draggable
              onDragStart={(e) => handleDragStart(e, tip as TipMarkera)}
              className={styles.markerTool}
            >
              <Icon />
              <span>{translateMarkerType(tip as TipMarkera)}</span>
            </div>
          ))}
        </div>
      </div>

      <div 
        className={styles.planContainer}
        style={{ transform: `rotate(${planRotation}deg)` }}
      >
        <div className={styles.planWrapper}>
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/uploads${tsekh?.planIzobrazhenie}`}
            alt={`План ${tsekh?.nazvanie}`}
            className={styles.planImage}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            draggable={false}
          />
          
          {dragPreview.tip && (
            <div
              className={cn(styles.marker, styles.preview)}
              style={{
                position: 'absolute',
                left: `${dragPreview.x}%`,
                top: `${dragPreview.y}%`,
                transform: `translate(-50%, -50%)`
              }}
            >
              <div className={styles.previewIcon}>
                {MarkerIcons[dragPreview.tip]({ color: 'rgba(0,0,0,0.5)' })}
              </div>
            </div>
          )}

          {tsekh?.markery.map((marker) => {
            const Icon = MarkerIcons[marker.tip];
            return (
              <div
                key={marker.id}
                className={cn(styles.marker, styles[marker.tip])}
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  transform: `translate(-50%, -50%) rotate(${marker.povorot}deg)`
                }}
                onClick={() => handleMarkerClick(marker)}
              >
                <Icon />
              </div>
            );
          })}
        </div>
      </div>

      {selectedMarker && (
        <div 
          ref={popupRef}
          className={styles.markerPopup}
        >
          <h3>Маркер: {translateMarkerType(selectedMarker.tip)}</h3>
          <div className={styles.rotationControls}>
            <input
              type="range"
              min="0"
              max="360"
              value={markerRotation}
              onChange={(e) => handleRotationChange(Number(e.target.value))}
            />
            <span>{markerRotation}°</span>
          </div>
          <button
            className={styles.delete}
            onClick={() => udalitMarkerMutation.mutate(selectedMarker.id)}
          >
            Удалить маркер
          </button>
        </div>
      )}
    </div>
  );
}

function translateMarkerType(tip: TipMarkera): string {
  const translations = {
    [TipMarkera.OBORUDOVANIE]: 'Оборудование',
    [TipMarkera.OGNETUSHITEL]: 'Огнетушитель',
    [TipMarkera.APTECHKA]: 'Аптечка',
    [TipMarkera.VYKHOD]: 'Выход'
  };
  return translations[tip];
} 