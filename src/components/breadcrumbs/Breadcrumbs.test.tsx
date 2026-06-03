import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import * as useBreadcrumbsHook from 'hooks/useBreadcrumbs';

jest.mock('hooks/useBreadcrumbs');

describe('Breadcrumbs Component', () => {
  const mockCategory = {
    region: ['region1'],
    country: ['country1'],
    activity: ['activity1'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useBreadcrumbsHook.useBreadcrumbs as jest.Mock).mockReturnValue([
      { name: 'Country 1', url: 'countries/country1' },
      { name: 'Region 1', url: 'regions/region1' },
    ]);
  });

  it('renders home link initially', () => {
    render(<Breadcrumbs category={mockCategory} postTitle="Test Post" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders breadcrumbs from the hook', () => {
    render(<Breadcrumbs category={mockCategory} postTitle="Test Post" />);
    expect(screen.getByText('Country 1')).toBeInTheDocument();
    expect(screen.getByText('Region 1')).toBeInTheDocument();
  });

  it('renders the post title', () => {
    render(<Breadcrumbs category={mockCategory} postTitle="Test Post Title" />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('renders parent data if provided', () => {
    render(
      <Breadcrumbs 
        category={mockCategory} 
        postTitle="Test Post" 
        parentData={{ id: 'parent-id', title: 'Parent Post' }} 
      />
    );
    expect(screen.getByText('Parent Post')).toBeInTheDocument();
  });
});
