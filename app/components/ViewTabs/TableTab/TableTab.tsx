import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import type { RainLog } from '@/types/rainlogger';

interface TableTabProps {
  data: RainLog[];
}

export default function TableTab({ data }: TableTabProps) {
  const { t } = useTranslation();

  const sortedData = useMemo(() => [...data].sort((a, b) => a.date.localeCompare(b.date)), [data]);

  const handleUpdate = (id: string) => {
    console.log('Update:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete:', id);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, maxWidth: { sm: 450 } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">{t('pages.watchLogs.table.date')}</TableCell>
            <TableCell align="center">{t('pages.watchLogs.table.amount')}</TableCell>
            <TableCell align="right">{t('pages.watchLogs.table.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((log) => (
            <TableRow key={log._id}>
              <TableCell align="left">{log.date.slice(0, 10)}</TableCell>
              <TableCell align="center">{log.measurement}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleUpdate(log._id)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(log._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
