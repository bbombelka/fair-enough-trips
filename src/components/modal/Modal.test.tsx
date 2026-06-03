import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';
import * as utils from 'utils';

jest.mock('utils', () => ({
  ...jest.requireActual('utils'),
  isMobileDevice: jest.fn(),
}));

describe('Modal Component', () => {
  it('renders children and title on desktop', () => {
    (utils.isMobileDevice as jest.Mock).mockReturnValue(false);
    render(
      <Modal title="Modal Title" closeModalCallback={jest.fn()}>
        <div data-testid="modal-child">Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByTestId('modal-child')).toBeInTheDocument();
  });

  it('does not render title on mobile device', () => {
    (utils.isMobileDevice as jest.Mock).mockReturnValue(true);
    render(
      <Modal title="Modal Title" closeModalCallback={jest.fn()}>
        Content
      </Modal>
    );

    expect(screen.queryByText('Modal Title')).not.toBeInTheDocument();
  });

  it('calls closeModalCallback when close icon is clicked', () => {
    const mockClose = jest.fn();
    const { container } = render(<Modal closeModalCallback={mockClose}>Content</Modal>);
    
    fireEvent.click(container.querySelector('.close-icon')!);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll on mount and unlocks on unmount', () => {
    const { unmount } = render(<Modal closeModalCallback={jest.fn()}>Content</Modal>);
    expect(document.body.style.overflowY).toBe('hidden');
    expect(document.body.style.height).toBe('100vh');

    unmount();
    expect(document.body.style.overflowY).toBe('');
    expect(document.body.style.height).toBe('');
  });
});
