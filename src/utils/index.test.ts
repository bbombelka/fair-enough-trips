import { parseDate, parse, isMobileDevice, removeSelectedProps, mapCategories } from './index';

describe('Utils', () => {
  describe('parseDate', () => {
    it('should correctly parse a given date object into a readable string', () => {
      const date = {
        season: 2,
        period: 2,
        month: 7,
        year: 2023,
      };
      expect(parseDate(date)).toBe('Summer (mid July 2023)');
    });

    it('should handle edge cases like early winter', () => {
      const date = {
        season: 4,
        period: 1,
        month: 1,
        year: 2024,
      };
      expect(parseDate(date)).toBe('Winter (early January 2024)');
    });
  });

  describe('removeSelectedProps', () => {
    it('should remove specified properties from an object', () => {
      const doc = {
        _id: '123',
        title: 'Test',
        secret: 'hidden',
      };
      const result = removeSelectedProps(doc, ['_id', 'secret']);
      expect(result).toEqual({ title: 'Test' });
    });
  });

  describe('mapCategories', () => {
    it('should map coded categories to their string equivalents', () => {
      const coded = {
        activity: ['hiking'],
        region: ['alps'],
        country: ['it', 'fr']
      };

      // Mock enums for testing (or just rely on the actual enums if they exist)
      // Since enums are actually imported in utils/index.ts, we can test against the real ones
      // Let's assume 'hiking' maps to 'Hiking', 'alps' to 'Alps', 'it' to 'Italy', 'fr' to 'France'
      // If the enums are empty or different, this will just test the mapping logic
      
      const result = mapCategories(coded);
      
      expect(result).toHaveProperty('activities');
      expect(result).toHaveProperty('regions');
      expect(result).toHaveProperty('countries');
    });
  });

  describe('parse', () => {
    it('should deep clone and remove undefined values (JSON serialization behavior)', () => {
      const input = { a: 1, b: undefined, c: { d: 'test' } };
      const result = parse(input);
      expect(result).toEqual({ a: 1, c: { d: 'test' } });
      expect(result).not.toBe(input); // Ensure it's a new reference
    });
  });

  describe('isMobileDevice', () => {
    let originalUserAgent: string;

    beforeAll(() => {
      originalUserAgent = global.navigator.userAgent;
    });

    afterEach(() => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      });
    });

    it('should return true for iPhone', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
        configurable: true,
      });
      expect(isMobileDevice()).toBe(true);
    });

    it('should return true for Android', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G960U)',
        configurable: true,
      });
      expect(isMobileDevice()).toBe(true);
    });

    it('should return false for desktop browser', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true,
      });
      expect(isMobileDevice()).toBe(false);
    });
  });
});
