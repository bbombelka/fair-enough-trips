import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

describe('Layout Component', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <div data-testid="layout-child">Child Content</div>
      </Layout>
    );
    expect(screen.getByTestId('layout-child')).toBeInTheDocument();
  });

  it('renders title if provided', () => {
    render(<Layout title="Main Title">Content</Layout>);
    
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Main Title');
  });

  it('renders subtitle if provided', () => {
    render(<Layout subTitle="Sub Title">Content</Layout>);
    
    const subTitleElement = screen.getByRole('heading', { level: 2 });
    expect(subTitleElement).toBeInTheDocument();
    expect(subTitleElement).toHaveTextContent('Sub Title');
  });

  it('renders both title and subtitle', () => {
    render(
      <Layout title="Title" subTitle="Sub">
        Content
      </Layout>
    );
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Sub');
  });

  it('applies the generic layout class to the main element', () => {
    const { container } = render(<Layout>Content</Layout>);
    expect(container.firstChild).toHaveClass('layout');
  });
});
