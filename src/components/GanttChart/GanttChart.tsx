import { FC, useEffect, useRef } from 'react';
import styles from './GanttChart.module.scss';
import { Button } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Operation {
  id: string;
  operatsiya: string;
  polufabrikatName: string;
  start: Date;
  end: Date;
  duration: number;
  tipOborudovaniyaName: string;
  oborudovanieId: number;
  oborudovanieName: string;
}

interface Equipment {
  id: number;
  nazvanie: string;
  markirovka: string;
  tipOborudovaniyaName: string;
  operations: Operation[];
  totalWorkload: number;
  utilizationPercentage: number;
}

interface GanttChartProps {
  equipment: Equipment[];
  startDate: Date;
  endDate: Date;
  zakazName: string;
  izdelieName: string;
}

export const GanttChart: FC<GanttChartProps> = ({ 
  equipment, 
  startDate, 
  endDate,
  zakazName,
  izdelieName
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройка размеров и стилей
    const HOUR_WIDTH = 100;
    const ROW_HEIGHT = 60;
    const SIDEBAR_WIDTH = 300;
    const HEADER_HEIGHT = 80;
    const OPERATION_MARGIN = 5;
    const FONT_SIZE = 12;

    // Вычисляем общую длительность в часах
    const totalHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    
    // Устанавливаем размеры канваса
    canvas.width = SIDEBAR_WIDTH + (totalHours * HOUR_WIDTH);
    canvas.height = HEADER_HEIGHT + (equipment.length * ROW_HEIGHT);

    // Очищаем канвас
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем заголовок диаграммы
    const title = zakazName && izdelieName 
      ? `${zakazName} - ${izdelieName}`
      : 'Диаграмма Ганта';
    ctx.fillStyle = '#1f1f1f';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, 10, 25);
    ctx.font = '12px Arial';
    ctx.fillText(`Период: ${format(startDate, 'dd.MM.yyyy HH:mm')} - ${format(endDate, 'dd.MM.yyyy HH:mm')}`, 10, 45);

    // Рисуем временную шкалу
    ctx.strokeStyle = '#e0e0e0';
    ctx.fillStyle = '#1f1f1f';
    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.textAlign = 'center';

    for (let i = 0; i <= totalHours; i++) {
      const x = SIDEBAR_WIDTH + (i * HOUR_WIDTH);
      
      // Вертикальные линии
      ctx.beginPath();
      ctx.moveTo(x, HEADER_HEIGHT);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();

      // Метки времени
      const time = new Date(startDate.getTime() + (i * 60 * 60 * 1000));
      ctx.fillText(
        format(time, 'HH:mm', { locale: ru }),
        x - (HOUR_WIDTH / 2),
        HEADER_HEIGHT - 10
      );
      ctx.fillText(
        format(time, 'dd MMM', { locale: ru }),
        x - (HOUR_WIDTH / 2),
        HEADER_HEIGHT - 30
      );
    }

    // Рисуем оборудование и операции
    equipment.forEach((eq, index) => {
      const y = HEADER_HEIGHT + (index * ROW_HEIGHT);

      // Название оборудования и загрузка
      ctx.fillStyle = '#1f1f1f';
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(eq.nazvanie, 10, y + 20);
      ctx.font = '12px Arial';
      ctx.fillText(`${eq.tipOborudovaniyaName}`, 10, y + 40);
      ctx.fillText(`Загрузка: ${eq.utilizationPercentage.toFixed(1)}%`, 10, y + 55);

      // Горизонтальные линии
      ctx.strokeStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      // Рисуем операции
      eq.operations.forEach(op => {
        const hoursSinceStart = (new Date(op.start).getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const operationDuration = (new Date(op.end).getTime() - new Date(op.start).getTime()) / (1000 * 60 * 60);
        
        const x = SIDEBAR_WIDTH + (hoursSinceStart * HOUR_WIDTH);
        const width = operationDuration * HOUR_WIDTH;

        // Фон операции
        ctx.fillStyle = '#1890ff';
        ctx.fillRect(x, y + OPERATION_MARGIN, width, ROW_HEIGHT - (OPERATION_MARGIN * 2));

        // Текст операции
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.font = '11px Arial';
        
        const text = `${op.operatsiya} (${op.polufabrikatName})`;
        const textWidth = ctx.measureText(text).width;
        
        if (textWidth < width - 10) {
          ctx.fillText(
            text,
            x + 5,
            y + (ROW_HEIGHT / 2)
          );
        }
      });
    });

  }, [equipment, startDate, endDate, zakazName, izdelieName]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Диаграмма Ганта - ${zakazName}</title>
          <style>
            body { margin: 0; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Диаграмма Ганта производства заказа</h3>
          <p className={styles.subtitle}>{zakazName} - {izdelieName}</p>
        </div>
        <Button 
          variant="contained" 
          className={styles.printButton}
          onClick={handlePrint}
        >
          Печать диаграммы
        </Button>
      </div>

      <div className={styles.ganttChart}>
        <canvas 
          ref={canvasRef}
          className={styles.canvas}
        />
      </div>
    </div>
  );
};