import NoLayout from '../layouts/NoLayout';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import React from 'react';

function Dashboard() {
  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Link href="/">
          <Button variant="outlined" size="small">
            ← العودة للرئيسية
          </Button>
        </Link>
      </Box>
      <Typography variant="h5">تحليل الأداء المالي</Typography>
    </Container>
  );
}

(Dashboard as any).getLayout = (page: any) => <NoLayout>{page}</NoLayout>;
export default Dashboard; 