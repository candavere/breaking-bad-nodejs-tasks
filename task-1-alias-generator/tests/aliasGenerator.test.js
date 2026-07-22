import { 
  extractFirstName, 
  sliceName, 
  selectSurname, 
  generateBreakingBadAlias,
  generateSuggestions
} from '../src/aliasGenerator.js';
import { CONFIG } from '../src/config.js'; 
describe('Breaking Bad Alias Generator', () => {
  describe('extractFirstName', () => {
    test('should extract first name from full name', () => {
      expect(extractFirstName('Walter White')).toBe('Walter');
      expect(extractFirstName('Jesse Pinkman')).toBe('Jesse');
    });
    
    test('should handle single name', () => {
      expect(extractFirstName('Heisenberg')).toBe('Heisenberg');
    });
    
    test('should trim whitespace', () => {
      expect(extractFirstName('  Gus  Fring  ')).toBe('Gus');
    });
    
    test('should throw error for invalid input', () => {
      
      expect(() => extractFirstName('')).toThrow('Name must be a non-empty string');
      expect(() => extractFirstName('   ')).toThrow('Name cannot be empty or only whitespace');
      expect(() => extractFirstName(null)).toThrow('Name must be a non-empty string');
    });
  });
  
  describe('sliceName', () => {
    test('should slice first N characters', () => {
      expect(sliceName('Walter', 4)).toBe('Walt');
      expect(sliceName('Jesse', 3)).toBe('Jes');
    });
    
    test('should handle names shorter than slice length', () => {
      expect(sliceName('Gus', 4)).toBe('Gus');
      expect(sliceName('Al', 5)).toBe('Al');
    });
    
    test('should handle empty string', () => {
      expect(sliceName('', 4)).toBe('');
    });
  });
  
  describe('selectSurname', () => {
    test('should return a surname from the list', () => {
      const surnames = ['White', 'Pinkman', 'Fring'];
      const result = selectSurname(surnames);
      expect(surnames).toContain(result);
    });
    
    test('should not repeat the same surname twice in a row', () => {
      const surnames = ['White', 'Pinkman'];
      const first = selectSurname(surnames);
      const second = selectSurname(surnames, first);
      expect(second).not.toBe(first);
    });
    
    test('should throw error for empty surname list', () => {
      expect(() => selectSurname([])).toThrow('Surnames list cannot be empty');
    });
  });
  
  describe('generateSuggestions', () => {
    test('should generate unique suggestions', () => {
      
      const suggestions = generateSuggestions('Walter', 4, CONFIG.SURNAMES, 5);
      const unique = new Set(suggestions);
      expect(unique.size).toBe(suggestions.length);
    });
    
    test('should return empty array for invalid name', () => {
      
      expect(generateSuggestions('', 4, CONFIG.SURNAMES)).toEqual([]);
    });
  });
  
  describe('generateBreakingBadAlias', () => {
    test('should generate a valid alias', () => {
      const result = generateBreakingBadAlias('Walter White');
      expect(result.alias).toMatch(/^[A-Za-z]+ [A-Za-z]+$/);
      expect(CONFIG.SURNAMES).toContain(result.selectedSurname);
    });
    
    test('should use specified character count', () => {
      const result = generateBreakingBadAlias('Walter White', { charCount: 3 });
      expect(result.alias).toMatch(/^Wal [A-Za-z]+$/);
    });
    
    test('should handle short names gracefully', () => {
      const result = generateBreakingBadAlias('Gus', { charCount: 4 });
      expect(result.alias).toMatch(/^Gus [A-Za-z]+$/);
    });
    
    test('should include suggestions', () => {
      const result = generateBreakingBadAlias('Mike', { charCount: 3 });
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
    
    test('should throw error for invalid input', () => {
      expect(() => generateBreakingBadAlias('')).toThrow('Failed to generate alias');
    });
  });
});