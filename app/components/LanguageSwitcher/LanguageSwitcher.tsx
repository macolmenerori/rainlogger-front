import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 80 }}>
      <InputLabel id="language-select-label">{t('components.languageSwitcher.label')}</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={i18n.resolvedLanguage}
        label={t('components.languageSwitcher.label')}
        onChange={handleLanguageChange}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="es">ES</MenuItem>
      </Select>
    </FormControl>
  );
}
