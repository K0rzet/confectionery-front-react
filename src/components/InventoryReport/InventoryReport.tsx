import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import styles from './InventoryReport.module.scss';
import { InventoryService } from '@/services/inventory.service';

enum InventoryType {
  INGREDIENTY = 'INGREDIENTY',
  UKRASHENIYA = 'UKRASHENIYA'
}

interface InventoryReportProps {
  onPrint?: () => void;
}

export const InventoryReport: FC<InventoryReportProps> = ({ onPrint }) => {
  const [type, setType] = useState<InventoryType>(InventoryType.INGREDIENTY);
  const [itemType, setItemType] = useState<string>('');

  // Получаем типы ингредиентов
  const { data: itemTypes } = useQuery({
    queryKey: ['itemTypes', type],
    queryFn: () => InventoryService.getItemTypes(type)
  });

  // Получаем данные отчета
  const { data: report } = useQuery({
    queryKey: ['inventoryReport', type, itemType],
    queryFn: () => InventoryService.getReport(type, itemType)
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2">
          Отчет по остаткам {type === InventoryType.INGREDIENTY ? 'ингредиентов' : 'украшений'}
        </Typography>
        
        <div className={styles.controls}>
          <FormControl className={styles.formControl}>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as InventoryType)}
              size="small"
            >
              <MenuItem value={InventoryType.INGREDIENTY}>Ингредиенты</MenuItem>
              <MenuItem value={InventoryType.UKRASHENIYA}>Украшения</MenuItem>
            </Select>
          </FormControl>

          {type === InventoryType.INGREDIENTY && itemTypes && (
            <FormControl className={styles.formControl}>
              <Select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                size="small"
                displayEmpty
              >
                <MenuItem value="">Все типы</MenuItem>
                {itemTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button 
            variant="contained" 
            onClick={handlePrint}
            className={styles.printButton}
          >
            Печать отчета
          </Button>
        </div>
      </div>

      {report && (
        <div className={styles.report}>
          {report.groups.map((group, index) => (
            <Paper key={index} className={styles.group}>
              <Typography variant="h6" className={styles.groupHeader}>
                Период: {group.dateRange}
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Артикул</TableCell>
                      <TableCell>Наименование</TableCell>
                      <TableCell>Количество</TableCell>
                      <TableCell>Ед. изм.</TableCell>
                      <TableCell>Цена</TableCell>
                      <TableCell>Стоимость</TableCell>
                      {type === InventoryType.INGREDIENTY && (
                        <TableCell>Тип</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.artikul}</TableCell>
                        <TableCell>{item.nazvanie}</TableCell>
                        <TableCell>{item.kolichestvo}</TableCell>
                        <TableCell>{item.edinitsa}</TableCell>
                        <TableCell>{item.zakupochnayaTsena}</TableCell>
                        <TableCell>
                          {(item.kolichestvo * item.zakupochnayaTsena).toFixed(2)}
                        </TableCell>
                        {type === InventoryType.INGREDIENTY && (
                          <TableCell>{item.tipIngredienta}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
}; 