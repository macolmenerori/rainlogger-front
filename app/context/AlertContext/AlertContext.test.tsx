import type { AlertColor } from '@mui/material';
import { render as baseRender } from '@testing-library/react';

import { AlertProvider, useAlert } from '@/context/AlertContext/AlertContext';
import { render, screen, userEvent, waitFor } from '@/test/utils/test-utils';
import { ThemeProvider } from '@/ui/theme/ThemeContext';

function AlertTrigger({
  message,
  severity,
  duration
}: {
  message: string;
  severity: AlertColor;
  duration?: number;
}) {
  const { showAlert } = useAlert();
  return <button onClick={() => showAlert(message, severity, duration)}>Trigger</button>;
}

describe('AlertContext', () => {
  it('throws error when useAlert is used outside AlertProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function BareComponent() {
      useAlert();
      return null;
    }

    expect(() => {
      baseRender(
        <ThemeProvider>
          <BareComponent />
        </ThemeProvider>
      );
    }).toThrow('useAlert must be used within an AlertProvider');

    spy.mockRestore();
  });

  it('shows an alert with the correct message', async () => {
    const user = userEvent.setup();

    render(
      <AlertProvider>
        <AlertTrigger message="Success!" severity="success" />
      </AlertProvider>
    );

    await user.click(screen.getByText('Trigger'));

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows an alert with error severity', async () => {
    const user = userEvent.setup();

    render(
      <AlertProvider>
        <AlertTrigger message="Something failed" severity="error" />
      </AlertProvider>
    );

    await user.click(screen.getByText('Trigger'));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Something failed');
    expect(alert).toHaveClass('MuiAlert-filledError');
  });

  it('closes the alert when the close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AlertProvider>
        <AlertTrigger message="Closeable" severity="warning" />
      </AlertProvider>
    );

    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Closeable')).toBeInTheDocument();

    const closeButton = screen.getByTitle('Close');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Closeable')).not.toBeInTheDocument();
    });
  });

  it('replaces the current alert when showAlert is called again', async () => {
    const user = userEvent.setup();

    function DoubleTrigger() {
      const { showAlert } = useAlert();
      return (
        <>
          <button onClick={() => showAlert('Message one', 'info')}>Trigger first</button>
          <button onClick={() => showAlert('Message two', 'error')}>Trigger second</button>
        </>
      );
    }

    render(
      <AlertProvider>
        <DoubleTrigger />
      </AlertProvider>
    );

    await user.click(screen.getByText('Trigger first'));
    expect(screen.getByRole('alert')).toHaveTextContent('Message one');

    await user.click(screen.getByText('Trigger second'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Message two');
    });
  });
});
