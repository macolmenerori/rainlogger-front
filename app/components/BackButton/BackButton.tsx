import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from '@mui/material';

interface BackButtonProps {
  to: string;
}

export default function BackButton({ to }: BackButtonProps) {
  const { t } = useTranslation();

  return (
    <Button component={Link} to={to} startIcon={<ArrowBackIosIcon />} variant="text">
      {t('components.backButton.label')}
    </Button>
  );
}
