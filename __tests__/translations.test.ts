import { translations } from '../utils/translations';

describe('Translations Dictionary', () => {
  it('should contain all supported languages', () => {
    expect(translations.en).toBeDefined();
    expect(translations.hi).toBeDefined();
    expect(translations.es).toBeDefined();
    expect(translations.vi).toBeDefined();
  });

  it('should return correct greeting translation in English', () => {
    expect(translations.en.welcomeBack).toBe('Welcome back');
  });

  it('should return correct greeting translation in Hindi', () => {
    expect(translations.hi.welcomeBack).toBe('स्वागत है');
  });
});
