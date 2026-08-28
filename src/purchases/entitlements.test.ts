import { isOperationLocked, FREE_OPERATION } from './entitlements';

describe('entitlements', () => {
  it('never locks the free operation', () => {
    expect(isOperationLocked(FREE_OPERATION, false)).toBe(false);
    expect(isOperationLocked(FREE_OPERATION, true)).toBe(false);
  });

  it('locks paid operations until unlocked', () => {
    expect(isOperationLocked('subtraction', false)).toBe(true);
    expect(isOperationLocked('multiplication', false)).toBe(true);
    expect(isOperationLocked('division', false)).toBe(true);
  });

  it('unlocks paid operations once purchased', () => {
    expect(isOperationLocked('subtraction', true)).toBe(false);
    expect(isOperationLocked('multiplication', true)).toBe(false);
    expect(isOperationLocked('division', true)).toBe(false);
  });
});
