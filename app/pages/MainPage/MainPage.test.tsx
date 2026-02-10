import MainPage from '@/pages/MainPage/MainPage';
import { i18n, render, screen } from '@/test/utils/test-utils';

describe('MainPage', () => {
  it('renders the page title with translated text', () => {
    render(<MainPage />);

    const expectedTitle = i18n.t('pages.mainPage.title');
    expect(screen.getByRole('heading', { name: expectedTitle })).toBeInTheDocument();
  });

  it('renders the New Log button with translated text', () => {
    render(<MainPage />);

    const expectedText = i18n.t('pages.mainPage.buttons.newLog');
    expect(screen.getByRole('link', { name: expectedText })).toBeInTheDocument();
  });

  it('New Log button links to /newlog', () => {
    render(<MainPage />);

    const expectedText = i18n.t('pages.mainPage.buttons.newLog');
    expect(screen.getByRole('link', { name: expectedText })).toHaveAttribute('href', '/newlog');
  });

  it('renders the Watch Logs button with translated text', () => {
    render(<MainPage />);

    const expectedText = i18n.t('pages.mainPage.buttons.watchLogs');
    expect(screen.getByRole('link', { name: expectedText })).toBeInTheDocument();
  });

  it('Watch Logs button links to /watchlogs', () => {
    render(<MainPage />);

    const expectedText = i18n.t('pages.mainPage.buttons.watchLogs');
    expect(screen.getByRole('link', { name: expectedText })).toHaveAttribute('href', '/watchlogs');
  });
});
