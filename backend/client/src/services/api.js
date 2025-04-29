
export const login = async (email, password) => {
  const response = await fetch(`http://localhost:3000/api/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return response.json()
}