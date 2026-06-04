import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Divider } from './Divider';
import * as checkWindowSizeHook from 'hooks/checkWindowSize';
import * as useSetDividerTopHook from './useSetDividerTop';

jest.mock('hooks/checkWindowSize');
jest.mock('./useSetDividerTop');

describe('Divider Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    (checkWindowSizeHook.checkWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    (useSetDividerTopHook.useSetDividerTop as jest.Mock).mockReturnValue({});
  });

  it('renders the title correctly', () => {
    render(<Divider title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Title');
  });

  it('sets the id to the title if id prop is not provided', () => {
    const { container } = render(<Divider title="TestTitleId" />);
    expect(container.firstChild).toHaveAttribute('id', 'TestTitleId');
  });

  it('sets the id to the id prop if provided', () => {
    const { container } = render(<Divider title="TestTitleId" id="custom-id" />);
    expect(container.firstChild).toHaveAttribute('id', 'custom-id');
  });

  it('applies sticky class and scroll behavior when isMobile is true', () => {
    (checkWindowSizeHook.checkWindowSize as jest.Mock).mockReturnValue({ isMobile: true });
    
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    const mockElement = document.createElement('div');
    mockElement.id = 'target-element';
    mockElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(mockElement);

    render(<Divider title="Test Title" stickyScrollToElementId="target-element" />);
    
    const container = screen.getByText('Test Title').parentElement!;
    // Note: since CSS modules are used, we can't easily check for 'sticky-divider-container' class exactly
    // but we can check if the click handler triggers scrollIntoView
    
    fireEvent.click(container);
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    
    document.body.removeChild(mockElement);
  });
  
  it('does not apply scroll behavior when isMobile is false', () => {
    (checkWindowSizeHook.checkWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    
    const scrollIntoViewMock = jest.fn();
    const mockElement = document.createElement('div');
    mockElement.id = 'target-element';
    mockElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(mockElement);

    render(<Divider title="Test Title" stickyScrollToElementId="target-element" />);
    
    const container = screen.getByText('Test Title').parentElement!;
    fireEvent.click(container);
    
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
    
    document.body.removeChild(mockElement);
  });

  it('throws an error in development if title equals stickyScrollToElementId', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    // Suppress console.error output from React error boundary during the test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<Divider title="SameValue" stickyScrollToElementId="SameValue" />);
    }).toThrow('title and stickyScrollToElementId cannot be identical due to accesibility duplicated id problem');
    
    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
