import * as validations from '../validations';
describe('validateUsernameOrEmail', () => {
  it('isValidUsername true', () => {
    expect(
      validations.isValidUsername({ username: 'tkmhousenew' })
    ).toBe(true);
  });
  it('isValidUsername false', () => {
    expect(validations.isValidUsername({ username: '11' })).toBe(false);
  });
  it('isValidEmail true', () => {
    expect(
      validations.isValidEmail({ email: 'tkmhousenew@gmail.com' })
    ).toBe(true);
  });

  it('isValidEmail false', () => {
    expect(
      validations.isValidEmail({ email: 'tkmhousenewgmail.com' })
    ).toBe(false);
  });
  it('isEmptyEmailOrUsername true', () => {
    expect(validations.isEmptyEmailOrUsername({ emailorusername: '' })).toBe(
      true
    );
  });

  it('isEmptyEmailOrUsername false', () => {
    expect(
      validations.isEmptyEmailOrUsername({ emailorusername: 'dfdf' })
    ).toBe(false);
  });

  it('isEmptyPassword true', () => {
    expect(validations.isEmptyPassword({ password: '' })).toBe(true);
  });

  it('isEmptyEmailOrUsername false', () => {
    expect(validations.isEmptyPassword({ password: 'sdsd' })).toBe(false);
  });

  it('isValidEmailOrUsername true', () => {
    expect(
      validations.isValidUsernameOrEmail({ emailorusername: 'tkmhouse' })
    ).toBe(true);
  });

  it('isValidEmailOrUsername false', () => {
    expect(validations.isValidUsernameOrEmail({ emailorusername: '122' })).toBe(
      false
    );
  });
});
