import React from 'react';
import { render, screen } from '@testing-library/react';
import { YoutubeIframe } from './YoutubeIframe';

describe('YoutubeIframe Component', () => {
  it('renders iframe with correct src and description', () => {
    render(<YoutubeIframe src="https://www.youtube.com/embed/12345" description="My cool video" />);

    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/12345');
    
    // Check allow attribute includes typical youtube requirements
    expect(iframe).toHaveAttribute('allow', expect.stringContaining('autoplay'));

    expect(screen.getByText('My cool video')).toBeInTheDocument();
  });
});
