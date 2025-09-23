import {getDeviceId} from "../utils/device.ts";

const API_BASE = import.meta.env.VITE_API_BASE;

export class AuthService {
  private static instance: AuthService;
  
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signin(email: string, password: string) {
    try {
        const deviceId = getDeviceId();

        const response = await fetch(`${API_BASE}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                deviceId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return response.json();
    } catch (err: any) {
        console.error("Sig-in error: ", err);
        return { message: err.message };
    }
  }

  async signup(email: string, password: string, firstName: string, middleName: string, lastName: string) {
      try {
          const deviceId = getDeviceId();

          const response = await fetch("http://localhost:3000/auth/sign-up", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  email,
                  password,
                  firstName,
                  lastName,
                  deviceId,
                  ...(middleName ? { middleName } : {}),
              }),
          });

          if (!response.ok) {
              const error = await response.json();
              throw error;
          }

          return await response.json();
      } catch (err: any) {
          console.error("Sign-up error:", err);
          return { message: err.message };
      }
  }

  async refreshToken(refreshToken: string) {
    const response = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  async signout(accessToken: string) {
    try {
      await fetch(`${API_BASE}/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Signout failed:', error);
    }
  }
}