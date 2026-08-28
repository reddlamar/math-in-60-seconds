import { cardShadow } from './shadow';

// jest-expo's Platform mock always resolves to iOS, matching the rest of
// this test suite (no other test in this codebase switches Platform.OS).
describe('cardShadow', () => {
  it('defaults the shadow offset height to the elevation', () => {
    expect(cardShadow({ elevation: 6, opacity: 0.18, radius: 8 })).toEqual({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
    });
  });

  it('allows overriding the offset height independently of elevation', () => {
    expect(cardShadow({ elevation: 3, opacity: 0.12, radius: 6, offsetHeight: 4 })).toEqual({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    });
  });
});
