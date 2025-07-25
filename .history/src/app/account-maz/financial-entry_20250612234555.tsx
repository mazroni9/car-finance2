import { useState, useEffect } from 'react';
import { Container, TextField, MenuItem, Button, Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import React from 'react';

const commonCategories = [
  { value: 'beginning_balance', label: 'رصيد بداية العام', recurring: false },
  { value: 'monthly_income', label: 'إيراد شهري', recurring: true },
  { value: 'salaries', label: 'رواتب شهرية', recurring: true },
  { value: 'bonuses', label: 'مكافآت موسمية', recurring: false },
  { value: 'bills', label: 'سداد فواتير', recurring: true },
  { value: 'fines', label: 'سداد غرامات', recurring: false },
  { value: 'rent', label: 'إيجارات شهرية', recurring: true },
  { value: 'services', label: 'صيانة وفحص', recurring: false },
  { value: 'transferred', label: 'مرحل من فترة سابقة', recurring: false },
  { value: 'municipal_fees', label: 'رسوم بلدية', recurring: false },
  { value: 'renewal_fees', label: 'رسوم تجديدات', recurring: false },
  { value: 'residence_renewal', label: 'رسوم تجديد إقامة', recurring: false },
  { value: 'insurance_fees', label: 'رسوم تأمينات اجتماعية', recurring: true },
  { value: 'tax_bills', label: 'فواتير ضريبية', recurring: false },
  { value: 'donations', label: 'تبرعات', recurring: false },
  { value: 'other', label: 'أخرى', recurring: false },
];

export default function FinancialEntryPage() {
  const monthNames = [
    { value: '1', label: 'يناير' },
    { value: '2', label: 'فبراير' },
    { value: '3', label: 'مارس' },
    { value: '4', label: 'أبريل' },
    { value: '5', label: 'مايو' },
    { value: '6', label: 'يونيو' },
    { value: '7', label: 'يوليو' },
    { value: '8', label: 'أغسطس' },
    { value: '9', label: 'سبتمبر' },
    { value: '10', label: 'أكتوبر' },
    { value: '11', label: 'نوفمبر' },
    { value: '12', label: 'ديسمبر' }
  ];

  const [form, setForm] = useState({
    type: 'مصروف',
    category: '',
    description: '',
    amount: '',
    month: '5', 
    note: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('5');

  const [balance, setBalance] = useState<number>(0);
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);

  const calculateBalance = (records: any[]) => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    records.forEach(record => {
      if (record.type === 'دخل') {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }
    });
    
    return totalIncome - totalExpense;
  };

  const calculateTotalIncome = (records: any[]) => {
    return records
      .filter(record => record.type === 'دخل')
      .reduce((total, record) => total + record.amount, 0);
  };

  const calculateTotalExpense = (records: any[]) => {
    return records
      .filter(record => record.type === 'مصروف')
      .reduce((total, record) => total + record.amount, 0);
  };

  const loadRecords = async () => {
    try {
      const response = await fetch('/api/financial-entry');
      const data = await response.json();
      setRecords(data);
      filterRecordsByMonth(data, selectedMonth);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const filterRecordsByMonth = (allRecords: any[], month: string) => {
    const filtered = allRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordMonth = recordDate.getMonth() + 1;
      return recordMonth.toString() === month;
    });
    
    setFilteredRecords(filtered);
    const currentBalance = calculateBalance(filtered);
    setBalance(currentBalance);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setForm({ ...form, month: month });
    filterRecordsByMonth(records, month);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      filterRecordsByMonth(records, selectedMonth);
    }
    setForm(prevForm => ({ ...prevForm, month: selectedMonth }));
  }, [selectedMonth, records]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('amount', form.amount);
    formData.append('month', form.month);
    formData.append('note', form.note);
    
    if (selectedFile) {
      formData.append('attachment', selectedFile);
    }
    
    if (editingRecord) {
      formData.append('id', editingRecord.id);
    }

    const res = await fetch('/api/financial-entry', {
      method: editingRecord ? 'PUT' : 'POST',
      body: formData
    });
    
    if (res.ok) {
      alert(editingRecord ? 'تم تحديث البيانات بنجاح' : 'تم حفظ البيانات بنجاح');
      setForm({ type: 'مصروف', category: '', description: '', amount: '', month: '5', note: '' });
      setSelectedFile(null);
      setEditingRecord(null);
      loadRecords();
    } else {
      alert('فشل في حفظ البيانات');
    }
  };

  const handleDelete = async (id: number) => {
    if (!adminMode) return;
    
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const res = await fetch(`/api/financial-entry?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('تم حذف السجل بنجاح');
        loadRecords();
      } else {
        alert('فشل في حذف السجل');
      }
    }
  };

  const handleEdit = (record: any) => {
    if (!adminMode) return;
    
    const recordDate = new Date(record.date);
    const recordMonth = (recordDate.getMonth() + 1).toString();
    
    setForm({
      type: record.type,
      category: record.category,
      description: record.description,
      amount: record.amount.toString(),
      month: recordMonth,
      note: record.note || ''
    });
    setEditingRecord(record);
  };

  const cancelEdit = () => {
    setForm({ type: 'مصروف', category: '', description: '', amount: '', month: '5', note: '' });
    setEditingRecord(null);
    setSelectedFile(null);
  };

  return (    <Container maxWidth="sm">
    <Box sx={{ mb: 2 }}>
      <Link href="/">
        <Button variant="outlined" size="small">
          العودة للرئيسية
        </Button>
      </Link>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h5">
        {editingRecord ? 'تعديل بيان مالي' : 'إدخال بيان مالي جديد'}
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={adminMode}
            onChange={(e) => setAdminMode(e.target.checked)}
            color="warning"
          />
        }
        label="وضع الأدمن"
      />
    </Box>
    
    {editingRecord && (
      <Box sx={{ p: 2, mb: 2, backgroundColor: '#fff3cd', borderRadius: 1, border: '1px solid #ffeaa7' }}>
        <Typography variant="body2" color="text.secondary">
          يتم الآن تعديل السجل رقم: {editingRecord.id}
        </Typography>
        <Button onClick={cancelEdit} size="small" sx={{ mt: 1 }}>
          إلغاء التعديل
        </Button>
      </Box>
           )}
     
     <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
       <Typography variant="h6" sx={{ mb: 2 }}>عرض بيانات الشهر:</Typography>
       <TextField 
         select 
         label="اختر الشهر" 
         value={selectedMonth} 
         onChange={(e) => handleMonthChange(e.target.value)}
         sx={{ minWidth: 200 }}
       >
         {monthNames.map(month => (
           <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
         ))}
       </TextField>
     </Box>
     
     <Box component="form" onSubmit={handleSubmit}>
      <TextField select fullWidth label="نوع العملية" name="type" value={form.type} onChange={handleChange} margin="normal">
        <MenuItem value="دخل">دخل</MenuItem>
        <MenuItem value="مصروف">مصروف</MenuItem>
      </TextField>
      <TextField select fullWidth label="التصنيف العام" name="category" value={form.category} onChange={handleChange} margin="normal" required>
        {commonCategories.map(cat => (
          <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
        ))}
      </TextField>
      <TextField fullWidth label="الوصف" name="description" value={form.description} onChange={handleChange} margin="normal" required />
      <TextField fullWidth type="number" label="المبلغ" name="amount" value={form.amount} onChange={handleChange} margin="normal" required />
      <TextField 
        select 
        fullWidth 
        label="الشهر" 
        name="month" 
        value={form.month} 
        margin="normal" 
        required
        disabled
        helperText="الشهر مرتبط بالاختيار في الأعلى"
      >
        {monthNames.map(month => (
          <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
        ))}
      </TextField>
      <TextField fullWidth label="ملاحظات" name="note" value={form.note} onChange={handleChange} margin="normal" />
      
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          مرفق (اختياري)
        </Typography>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        {selectedFile && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            الملف المحدد: {selectedFile.name}
          </Typography>
        )}
      </Box>
      
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        {editingRecord ? 'تحديث البيان' : 'حفظ البيان'}
      </Button>
      
      <Box sx={{ mt: 2, p: 3, backgroundColor: '#fff4e6', borderRadius: 1, border: '2px solid #ff9800' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                إجمالي الدخل
              </Typography>
              <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                {calculateTotalIncome(filteredRecords).toLocaleString()} ر.س
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffeaea', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                إجمالي الصرف
              </Typography>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                {calculateTotalExpense(filteredRecords).toLocaleString()} ر.س
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: balance >= 0 ? '#e3f2fd' : '#ffebee', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                الرصيد النهائي
              </Typography>
              <Typography variant="h6" sx={{ color: balance >= 0 ? '#1976d2' : '#d32f2f', fontWeight: 'bold' }}>
                {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ر.س
        </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: balance >= 0 ? '#2e7d32' : '#d32f2f' }}>
            {balance >= 0 ? 'لديك فائض مالي' : 'لديك عجز مالي'}
        </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>العمليات المالية المحفوظة</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>النوع</TableCell>
              <TableCell>التصنيف</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>المبلغ</TableCell>
              <TableCell>التاريخ</TableCell>
              {adminMode && <TableCell>إجراءات</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      backgroundColor: record.type === 'دخل' ? '#e8f5e8' : '#ffeaea',
                      color: record.type === 'دخل' ? '#2e7d32' : '#d32f2f',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {record.type}
                  </Box>
                </TableCell>
                <TableCell>{record.category}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell 
                  sx={{ 
                    color: record.type === 'دخل' ? '#2e7d32' : '#d32f2f',
                    fontWeight: 'bold'
                  }}
                >
                  {record.type === 'دخل' ? '+' : '-'}{record.amount.toLocaleString()} ر.س
                </TableCell>
                <TableCell>
                  {new Date(record.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit', 
                    day: '2-digit'
                  })}
                </TableCell>
                {adminMode && (
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEdit(record)} 
                      color="primary" 
                      size="small"
                      title="تعديل"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(record.id)} 
                      color="error" 
                      size="small"
                      title="حذف"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {filteredRecords.length > 0 && (
              <TableRow sx={{ backgroundColor: '#f5f5f5', borderTop: '2px solid #ddd' }}>
                <TableCell colSpan={3} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  الإجمالي
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <Box sx={{ color: balance >= 0 ? '#2e7d32' : '#d32f2f' }}>
                    {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ر.س
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: balance >= 0 ? '#2e7d32' : '#d32f2f' }}>
                  {balance >= 0 ? 'فائض' : 'عجز'}
                </TableCell>
                {adminMode && <TableCell></TableCell>}
              </TableRow>
            )}
            
            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={adminMode ? 6 : 5} align="center">
                  لا توجد عمليات مالية في شهر {monthNames.find(m => m.value === selectedMonth)?.label}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Container>
  );
}
