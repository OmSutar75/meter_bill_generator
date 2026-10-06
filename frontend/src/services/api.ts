export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  city: string;
  birthDate: string; // ISO String format (e.g., 'YYYY-MM-DDTHH:mm:ss') for LocalDateTime compatibility
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  city: string;
  birthDate: string;
}

export const apiService = {
    async postWithParams<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Converts { email: 'a@b.com', password: '123' } to ?email=a%40b.com&password=123
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${cleanEndpoint}?${queryString}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  },
    async post<T>(endpoint: string, data:unknown): Promise<T>{
        const response = await fetch(`${BASE_URL}/${endpoint}`,
            {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: "include",

                body: JSON.stringify(data),
                });
            
            if(!response.ok){
                throw new Error(`HTTP error! Status : ${response.status}`);
            }
        return response.json() as Promise<T>;
            
    },
    
    async get<T>(endpoint: string): Promise<T>{
        const response = await fetch(`${BASE_URL}/${endpoint}`,
            {
                method: 'GET',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: "include",
                });
            if(!response.ok){
                throw new Error(`HTTP error! Status : ${response.status}`);
            }
        return response.json() as Promise<T>;
    }
}