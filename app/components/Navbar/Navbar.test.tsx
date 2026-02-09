import Navbar from '@/components/Navbar/Navbar';
import { i18n, render, screen, userEvent } from '@/test/utils/test-utils';
import { tokenStorage } from '@/utils/tokenStorage';

describe('Navbar', () => {
  beforeEach(() => {
    tokenStorage.setToken('fake-jwt-token');
  });

  afterEach(() => {
    tokenStorage.removeToken();
  });

  it('renders the app title with translated text', () => {
    render(<Navbar />);

    const expectedTitle = i18n.t('components.navbar.title');
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it('renders the logout button with translated text', () => {
    render(<Navbar />);

    const expectedLogout = i18n.t('components.navbar.logout');
    expect(screen.getByText(expectedLogout)).toBeInTheDocument();
  });

  it('title links to the home page', () => {
    render(<Navbar />);

    const expectedTitle = i18n.t('components.navbar.title');
    const titleLink = screen.getByText(expectedTitle).closest('a');
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('removes token when logout button is clicked', async () => {
    const user = userEvent.setup();

    render(<Navbar />);

    const expectedLogout = i18n.t('components.navbar.logout');
    const logoutButton = screen.getByText(expectedLogout);

    await user.click(logoutButton);

    expect(tokenStorage.hasToken()).toBe(false);
  });

  it('renders the language switcher', () => {
    render(<Navbar />);

    const expectedLabel = i18n.t('components.languageSwitcher.label');
    expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
  });
});
