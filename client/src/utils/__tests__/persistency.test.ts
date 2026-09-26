import { cleanup } from '@testing-library/react';

import { getItem, itemExists, removeItem, setItem } from '../persistency';

describe('persistency', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('should store data in localStorage', () => {
    setItem('foo', 'bar');
    expect(window.localStorage.getItem('foo')).toBe('"bar"');
  });

  it('should return true if item exists', () => {
    setItem('foo', 'bar');
    expect(itemExists('foo')).toBe(true);
  });

  it('should return false if item does not exist', () => {
    expect(itemExists('foo')).toBe(false);
  });

  it('should return item if it exists', () => {
    setItem('foo', 'bar');
    expect(getItem('foo')).toBe('bar');
  });

  it('should return undefined if item does not exist', () => {
    expect(getItem('foo')).toBe(undefined);
  });

  it('should remove item from localStorage', () => {
    setItem('foo', 'bar');
    expect(window.localStorage.getItem('foo')).toBe('"bar"');
    removeItem('foo');
    expect(window.localStorage.getItem('foo')).toBe(null);
  });
});
