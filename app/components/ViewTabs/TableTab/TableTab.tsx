import { useMemo, useState } from 'react';
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

import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import UpdateLogModal from '@/components/UpdateLogModal/UpdateLogModal';
import type { RainLog } from '@/types/rainlogger';

interface TableTabProps {
  data: RainLog[];
  onDataChange?: () => Promise<void>;
}

export default function TableTab({ data, onDataChange }: TableTabProps) {
  const { t } = useTranslation();
  const [editingLog, setEditingLog] = useState<RainLog | null>(null);
  const [deletingLog, setDeletingLog] = useState<RainLog | null>(null);

  const sortedData = useMemo(() => [...data].sort((a, b) => a.date.localeCompare(b.date)), [data]);

  return (
    <>
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
                  <IconButton size="small" onClick={() => setEditingLog(log)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeletingLog(log)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editingLog && (
        <UpdateLogModal
          open={!!editingLog}
          log={editingLog}
          onClose={() => setEditingLog(null)}
          onDataChange={onDataChange}
        />
      )}

      {deletingLog && (
        <ConfirmDeleteModal
          open={!!deletingLog}
          log={deletingLog}
          onClose={() => setDeletingLog(null)}
          onDataChange={onDataChange}
        />
      )}
    </>
  );
}
