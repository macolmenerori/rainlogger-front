import { useTranslation } from 'react-i18next';

import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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
        value={i18n.language}
        label={t('components.languageSwitcher.label')}
        onChange={handleLanguageChange}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="es">ES</MenuItem>
      </Select>
    </FormControl>
  );
}
