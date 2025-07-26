import NoLayout from '../layouts/NoLayout';
import { Container, Typography, Box } from '@mui/material';
import Link from 'next/link';
import React from 'react';

function Finance() {
  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
          ← العودة للرئيسية
        </Link>
      </Box>
      <Typography variant="h5">نظام الحسابات والتقارير</Typography>
    </Container>
  );
}

(Finance as any).getLayout = (page: any) => <NoLayout>{page}</NoLayout>;
export default Finance; 