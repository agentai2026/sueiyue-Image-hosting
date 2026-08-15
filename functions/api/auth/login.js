import { fetchSecurityConfig } from "../../utils/sysConfig.js";
import { verifyPassword, rehashIfNeeded } from "../../utils/auth/passwordHash.js";
import { createSession } from "../../utils/auth/sessionManager.js";
import { getDatabase } from "../../utils/databaseAdapter.js";

export async function onRequestPost(context) {
    const { request, env } = context;

    const jsonRequest = await request.json();
    const authCode = jsonRequest.authCode;

    let securityConfig;
    try {
        securityConfig = await fetchSecurityConfig(env, { throwOnError: true });
    } catch (error) {
        console.error('User login blocked because security config could not be loaded:', error);
        return new Response('Security config unavailable', { status: 503 });
    }
    const rightAuthCode = securityConfig.auth.user.authCode;

    if (rightAuthCode !== undefined && rightAuthCode !== '') {
        const isValid = await verifyPassword(authCode, rightAuthCode);
        if (!isValid) {
            return new Response('Unauthorized', { status: 401 });
        }

        await rehashIfNeeded(getDatabase(env), authCode, rightAuthCode, 'auth.user.authCode');
    }

    const { cookie } = await createSession(env, 'user');

    return new Response('Login success', {
        status: 200,
        headers: {
            'Set-Cookie': cookie,
        },
    });
}
