export const validatePassword = (password: string): string | true => {
  if (password.length < 5 || password.length > 20) {
    return 'Password must be between 5 and 20 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  return true
}
