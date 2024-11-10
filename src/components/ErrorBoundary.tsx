import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Произошла неизвестная ошибка';
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        errorMessage = 'Страница не найдена';
        errorDetails = 'Запрашиваемая страница не существует';
        break;
      case 401:
        errorMessage = 'Нет доступа';
        errorDetails = 'Пожалуйста, авторизуйтесь';
        break;
      case 403:
        errorMessage = 'Доступ запрещен';
        errorDetails = 'У вас нет прав для просмотра этой страницы';
        break;
      case 500:
        errorMessage = 'Ошибка сервера';
        errorDetails = 'Попробуйте повторить попытку позже';
        break;
      default:
        errorMessage = `Ошибка ${error.status}`;
        errorDetails = error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 3,
          py: 4,
        }}
      >
        <ErrorIcon color="error" sx={{ fontSize: 64 }} />
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="error">
            {errorMessage}
          </Typography>
          
          {errorDetails && (
            <Typography 
              color="text.secondary" 
              sx={{ mb: 3 }}
              component="pre"
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}
            >
              {errorDetails}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={() => navigate(-1)}
              color="primary"
            >
              Назад
            </Button>
            
            <Button 
              variant="outlined"
              onClick={() => navigate('/', { replace: true })}
            >
              На главную
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 