import { afterEach, describe, expect, it, vi } from 'vitest';

import LanguageSwitcher from './LanguageSwitcher';

import { i18n, render, screen, userEvent } from '@/test/utils/test-utils';

describe('LanguageSwitcher', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the language switcher with current language', () => {
    render(<LanguageSwitcher />);

    const expectedLabel = i18n.t('components.languageSwitcher.label');
    const selectElement = screen.getByLabelText(expectedLabel);

    expect(selectElement).toBeInTheDocument();
  });

  it('changes language when a different option is selected', async () => {
    const user = userEvent.setup();

    // Mock i18n.changeLanguage to prevent actual language changes
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage').mockResolvedValue(i18n.t);

    render(<LanguageSwitcher />);

    const expectedLabel = i18n.t('components.languageSwitcher.label');
    const selectElement = screen.getByLabelText(expectedLabel);

    // Get the current language to determine which option to select
    const currentLanguage = i18n.resolvedLanguage;
    const targetLanguage = currentLanguage === 'en' ? 'es' : 'en';
    const targetOptionText = targetLanguage.toUpperCase(); // 'EN' or 'ES'

    // Open the dropdown
    await user.click(selectElement);

    // Find and click the target language option
    const targetOption = screen.getByRole('option', { name: targetOptionText });
    await user.click(targetOption);

    // Verify that changeLanguage was called with the correct language code
    expect(changeLanguageSpy).toHaveBeenCalledWith(targetLanguage);
    expect(changeLanguageSpy).toHaveBeenCalledTimes(1);
  });
});
