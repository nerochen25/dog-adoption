export const API_BASE = 'https://frontend-take-home-service.fetch.com';

export async function login(name: string, email: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    alert(`Login failed: ${response.status} ${errorText}`);
  }

  return;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    alert(`Logout failed: ${response.status} ${errorText}`);
  }
  
  return;
}




  





  



  

  
  
