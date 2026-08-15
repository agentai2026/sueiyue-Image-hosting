import { validateAnySession } from "../../utils/auth/sessionManager.js";
import { fetchSecurityConfig } from "../../utils/sysConfig.js";

/**
 * 会话检查接口
 * 管理端无需登录；上传端按是否配置 authCode 决定是否要求登录
 */
export async function onRequestGet(context) {
    const { request, env } = context;

    let securityConfig;
    try {
        securityConfig = await fetchSecurityConfig(env, { throwOnError: true });
    } catch (error) {
        console.error('Session check failed because security config could not be loaded:', error);
        return new Response(JSON.stringify({ error: 'Security config unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const userAuthCode = securityConfig.auth.user.authCode;
    const adminRequired = false;
    const userRequired = !!(userAuthCode && userAuthCode.trim());

    const sessionResult = await validateAnySession(env, request);
    if (sessionResult.valid) {
        return new Response(JSON.stringify({
            valid: true,
            authType: sessionResult.session.authType,
            adminRequired,
            userRequired,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({
        valid: false,
        adminRequired,
        userRequired,
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
