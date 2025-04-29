export const verifyToken = async (token) => {
    // In a real app, you might verify with backend
    try {
      // Simple JWT decode (frontend only - real app should verify with backend)
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(base64))
      return { ...payload, token }
    } catch {
      return null
    }
  }