import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import styles from './PurchaseReport.module.scss';
import { PurchaseService } from '@/services/purchase.service';

interface SupplierPurchase {
  postavshchikId: number;
  postavshchikName: string;
  instruments: string;
  totalQuantity: number;
}

interface PurchaseReportData {
  suppliers: SupplierPurchase[];
  totalInstruments: number;
}

export const PurchaseReport: FC = () => {
  const { data: report, isLoading } = useQuery<PurchaseReportData>({
    queryKey: ['purchaseReport'],
    queryFn: () => PurchaseService.getReport()
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div>Загрузка отчета...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2">
          Отчет по закупкам инструмента
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          className={styles.printButton}
        >
          Печать отчета
        </Button>
      </div>

      {report && (
        <>
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Поставщик</TableCell>
                  <TableCell>Инструменты</TableCell>
                  <TableCell align="right">Общее количество</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.suppliers.map((supplier) => (
                  <TableRow key={supplier.postavshchikId}>
                    <TableCell component="th" scope="row">
                      {supplier.postavshchikName}
                    </TableCell>
                    <TableCell className={styles.instrumentsCell}>
                      {supplier.instruments}
                    </TableCell>
                    <TableCell align="right">
                      {supplier.totalQuantity}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className={styles.totalRow}>
                  <TableCell colSpan={2}>
                    <strong>Итого:</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{report.totalInstruments}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className={styles.summary}>
            <Typography variant="body2" color="textSecondary">
              Всего поставщиков: {report.suppliers.length}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
}; 