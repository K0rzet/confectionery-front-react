import { FC, useState } from 'react';
import '@/utils/chartSetup';
import { useQuery } from '@tanstack/react-query';
import { 
  Paper, 
  Typography, 
  Button, 
  ToggleButton, 
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Print as PrintIcon, TableChart, BarChart } from '@mui/icons-material';
import { Bar, Chart as ChartJS, ChartData, ChartOptions } from 'react-chartjs-2';
import { format } from 'date-fns';
import styles from './EquipmentFailuresReport.module.scss';
import { EquipmentFailuresService } from '@/services/equipment-failures.service';

type ViewMode = 'table' | 'chart';

interface FailureData {
  id: number;
  oborudovanieName: string;
  masterName: string;
  vremyaNachala: Date;
  vremyaOkonchaniya: Date | null;
  durationMinutes: number;
  kommentariy: string;
}

interface FailureGroup {
  prichinaId: number;
  prichinaNazvanie: string;
  opisanie: string;
  failures: FailureData[];
  totalDuration: number;
  averageDuration: number;
  failureCount: number;
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface ChartProps {
  labels: string[];
  datasets: ChartDataset[];
}

export const EquipmentFailuresReport: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['failuresReport', startDate, endDate, viewMode],
    queryFn: () => EquipmentFailuresService.getReport({
      startDate,
      endDate,
      format: viewMode === 'chart' ? 'chart' : 'table'
    }),
    onError: (error: Error) => {
      setError(error.message || 'Произошла ошибка при загрузке отчета');
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}мин`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h5" component="h2">
            Отчет по сбоям оборудования
          </Typography>

          <div className={styles.controls}>
            <DatePicker
              label="Начало периода"
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              format="dd.MM.yyyy"
              className={styles.datePicker}
            />
            <DatePicker
              label="Конец периода"
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              format="dd.MM.yyyy"
              className={styles.datePicker}
            />
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="small"
            >
              <ToggleButton value="table">
                <TableChart />
              </ToggleButton>
              <ToggleButton value="chart">
                <BarChart />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              className={styles.printButton}
            >
              Печать
            </Button>
          </div>
        </div>

        {report && (
          <div className={styles.content}>
            <div className={styles.summary}>
              <Typography variant="subtitle1">
                Всего сбоев: {report.totalFailures}
              </Typography>
              <Typography variant="subtitle1">
                Общая длительность: {formatDuration(report.totalDuration)}
              </Typography>
            </div>

            {viewMode === 'table' ? (
              <div className={styles.tableView}>
                {report.groups.map((group) => (
                  <Paper key={group.prichinaId} className={styles.groupSection}>
                    <div className={styles.groupHeader}>
                      <Typography variant="h6">{group.prichinaNazvanie}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {group.opisanie}
                      </Typography>
                      <div className={styles.groupStats}>
                        <Typography>
                          Количество сбоев: {group.failureCount}
                        </Typography>
                        <Typography>
                          Общая длительность: {formatDuration(group.totalDuration)}
                        </Typography>
                        <Typography>
                          Средняя длительность: {formatDuration(group.averageDuration)}
                        </Typography>
                      </div>
                    </div>

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Оборудовние</TableCell>
                            <TableCell>Мастер</TableCell>
                            <TableCell>Начало</TableCell>
                            <TableCell>Окончание</TableCell>
                            <TableCell>Длительность</TableCell>
                            <TableCell>Комментарий</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.failures.map((failure) => (
                            <TableRow key={failure.id}>
                              <TableCell>{failure.oborudovanieName}</TableCell>
                              <TableCell>{failure.masterName}</TableCell>
                              <TableCell>
                                {format(new Date(failure.vremyaNachala), 'dd.MM.yyyy HH:mm')}
                              </TableCell>
                              <TableCell>
                                {failure.vremyaOkonchaniya 
                                  ? format(new Date(failure.vremyaOkonchaniya), 'dd.MM.yyyy HH:mm')
                                  : '-'
                                }
                              </TableCell>
                              <TableCell>{formatDuration(failure.durationMinutes)}</TableCell>
                              <TableCell>{failure.kommentariy}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ))}
              </div>
            ) : (
              <div className={styles.chartView}>
                {report.chartData && (
                  <Bar
                    data={report.chartData as ChartData<'bar'>}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: 'Статистика сбоев по причинам'
                        }
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error"
            variant="filled"
          >
            {error}
          </Alert>
        </Snackbar>
			</div>
		)
	}

