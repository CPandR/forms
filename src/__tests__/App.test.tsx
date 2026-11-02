import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../App';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('routes', () => {
  it.each(['/', '/unknown', '/had_form', '/exe_form/abc/extra'])('shows the wrong-turn page at %s', (path) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderAt(path);

    expect(screen.getByRole('heading', { name: 'Uh oh!' })).toBeInTheDocument();
    expect(screen.getByText(/taken a wrong turn/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.title).toBe('CP+R');
  });

  it.each([
    ['/had_form/abc123', 'validate_had_link', 'HAD Scale Form'],
    ['/exe_form/abc123', 'validate_exe_link', 'Exercise + Confidence Form'],
  ])('serves %s from the matching form definition', async (path, endpoint, heading) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);

    renderAt(path);

    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`https://hub.test/api/forms/${endpoint}/abc123`);
  });
});
