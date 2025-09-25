import { AuthService } from "./auth.ts";

export async function authorizedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    let headers: HeadersInit = {
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 && refreshToken) {
        const authService = AuthService.getInstance();
        try {
            const refreshRes = await authService.refreshToken(refreshToken);
            const newAccessToken = refreshRes.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            headers = {
                ...headers,
                Authorization: `Bearer ${newAccessToken}`,
            };
            response = await fetch(url, { ...options, headers });
        } catch (err) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}
