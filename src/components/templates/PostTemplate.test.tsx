import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostTemplate } from './PostTemplate';

// Mock child components to isolate the template logic
jest.mock('components/layout/Layout', () => ({
  Layout: ({ children, title }: any) => <div data-testid="mock-layout"><h1>{title}</h1>{children}</div>
}));
jest.mock('components/breadcrumbs/Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="mock-breadcrumbs" />
}));
jest.mock('components/trip-sections/TripSections', () => ({
  TripSections: () => <div data-testid="mock-trip-sections" />
}));
jest.mock('components/fet-map/FETMap', () => ({
  FETMap: () => <div data-testid="mock-fet-map" />
}));
jest.mock('components/route-scheme/RouteSchemeContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-route-scheme" />
}));
jest.mock('components/divider/Divider', () => ({
  Divider: ({ title }: any) => <div data-testid="mock-divider">{title}</div>
}));
jest.mock('components/paragraph/Paragraph', () => ({
  Paragraph: ({ title }: any) => <div data-testid="mock-paragraph">{title}</div>
}));
jest.mock('components/post-images/PostImages', () => ({
  PostImages: () => <div data-testid="mock-post-images" />
}));
jest.mock('components/card-list/CardList', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="mock-card-list">{children}</div>
}));
jest.mock('components/post-card/PostCard', () => ({
  PostCard: () => <div data-testid="mock-post-card" />
}));

describe('PostTemplate Component', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Trip',
    category: { region: [], country: [], activity: [] },
    shortDescription: ['Short desc'],
    links: {},
    description: [{ title: 'Desc', body: ['Desc body'] }],
    weather: ['Good weather'],
    trailCondition: ['Muddy'],
    other: ['Tips'],
    dangers: ['Bears'],
    gear: ['Boots'],
    transportation: ['Car'],
    accomodation: ['Tent'],
    provisions: ['Food'],
    images: [{ filename: '1.jpg' }],
    videos: [{ src: 'youtube.com' }]
  } as any;

  it('renders all sections when all data is provided', () => {
    render(
      <PostTemplate 
        post={mockPost}
        hasRouteScheme={true}
        posts={[{ id: 'other-post' } as any]}
        parentPostData={{ id: 'parent', title: 'Parent Trip' }}
        subPosts={[{ id: 'sub-post', title: 'Sub' }]}
        controlDisplayLinks={{}}
      />
    );

    expect(screen.getByText('Parent Trip')).toBeInTheDocument(); // Title is Parent if provided
    expect(screen.getByTestId('mock-breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('mock-trip-sections')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fet-map')).toBeInTheDocument();
    
    // Check dividers
    const dividers = screen.getAllByTestId('mock-divider');
    const dividerTitles = dividers.map(el => el.textContent);
    expect(dividerTitles).toEqual([
      'Route scheme',
      'Trip overview',
      'Route description',
      'Trip conditions',
      'Additional information',
      'Trip photos and videos',
      'Other trips to check'
    ]);

    expect(screen.getByTestId('mock-route-scheme')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-paragraph').length).toBeGreaterThan(0);
    expect(screen.getByTestId('mock-post-images')).toBeInTheDocument();
    expect(screen.getByTestId('mock-card-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-post-card')).toBeInTheDocument();
  });

  it('conditionally renders sections based on missing data', () => {
    const minimalPost = {
      id: 'minimal-post',
      title: 'Minimal Trip',
      category: { region: [], country: [], activity: [] },
      shortDescription: ['Short desc'],
      links: {},
      images: []
    } as any;

    render(
      <PostTemplate 
        post={minimalPost}
        hasRouteScheme={false}
        posts={[]}
        controlDisplayLinks={{}}
      />
    );

    expect(screen.getByText('Minimal Trip')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-trip-sections')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-route-scheme')).not.toBeInTheDocument();
    
    const dividers = screen.getAllByTestId('mock-divider');
    const dividerTitles = dividers.map(el => el.textContent);
    expect(dividerTitles).toEqual([
      'Trip overview',
      'Trip photos ' // Since there are no videos, the 'and videos' string is empty
    ]);

    expect(screen.queryByTestId('mock-post-images')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-card-list')).not.toBeInTheDocument();
  });

  it('renders correctly when only weather is provided in conditions', () => {
    const postWithWeatherOnly = {
      ...mockPost,
      weather: ['Sunny'],
      trailCondition: undefined,
    };
    render(<PostTemplate post={postWithWeatherOnly} hasRouteScheme={false} posts={[]} controlDisplayLinks={{}} />);
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.queryByText('Trail')).not.toBeInTheDocument();
  });

  it('renders correctly when only trail condition is provided in conditions', () => {
    const postWithTrailOnly = {
      ...mockPost,
      weather: undefined,
      trailCondition: ['Muddy'],
    };
    render(<PostTemplate post={postWithTrailOnly} hasRouteScheme={false} posts={[]} controlDisplayLinks={{}} />);
    expect(screen.queryByText('Weather')).not.toBeInTheDocument();
    expect(screen.getByText('Trail')).toBeInTheDocument();
  });

  it('renders correctly when only videos are provided', () => {
    const postWithVideosOnly = {
      ...mockPost,
      images: [],
      videos: [{ src: 'video.com' }],
    };
    render(<PostTemplate post={postWithVideosOnly} hasRouteScheme={false} posts={[]} controlDisplayLinks={{}} />);
    expect(screen.getByTestId('mock-post-images')).toBeInTheDocument();
  });
});
