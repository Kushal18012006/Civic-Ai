import { getAuthClient } from '../lib/supabase';

describe('Auth Fallback Driver', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should return a valid mock client even without env keys', () => {
    const auth = getAuthClient();
    expect(auth.signUp).toBeDefined();
    expect(auth.signInWithPassword).toBeDefined();
    expect(auth.signOut).toBeDefined();
    expect(auth.getSession).toBeDefined();
  });

  it('should perform mock signup and persist user metadata', async () => {
    const auth = getAuthClient();
    const signUpResult = await auth.signUp({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          name: 'Test User',
          age: 20,
          occupation: 'Student',
          income: 15000,
          location: 'Delhi',
          education: 'High School',
          language: 'en'
        }
      }
    });

    expect(signUpResult.error).toBeNull();
    expect(signUpResult.data.user).toBeDefined();
    expect(signUpResult.data.user?.email).toBe('test@example.com');
  });
});
