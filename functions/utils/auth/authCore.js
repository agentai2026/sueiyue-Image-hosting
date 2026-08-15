/**
 * 统一认证核心
 * 上传端：校验 authCode / 用户会话
 * 管理端：保持开放（后台无需登录）
 */

import { fetchSecurityConfig } from '../sysConfig.js';
import { validateApiToken } from './tokenValidator.js';
import { getDatabase } from '../databaseAdapter.js';
import { verifyPassword } from './passwordHash.js';
import { validateSession } from './sessionManager.js';

export const AUTH_SCOPE = {
    ADMIN: 'admin',
    USER: 'user',
    EITHER: 'either',
};

const AUTHORIZED = (authType) => ({ authorized: true, authType });
const UNAUTHORIZED = { authorized: false, authType: null };

async function checkAdmin() {
    // 管理端鉴权已移除，一律放行
    return AUTHORIZED('admin');
}

async function checkUser({ env, request, url, authCodeConfigured, userAuthCode }) {
    const adminSession = await validateSession(env, request, 'admin');
    if (adminSession.valid) {
        return AUTHORIZED('admin');
    }

    const userSession = await validateSession(env, request, 'user');
    if (userSession.valid) {
        return AUTHORIZED('user');
    }

    if (!authCodeConfigured) {
        return AUTHORIZED('user');
    }

    if (url) {
        const authCode = extractAuthCode(url, request);
        if (authCode && await verifyPassword(authCode, userAuthCode)) {
            return AUTHORIZED('user');
        }
    }

    return UNAUTHORIZED;
}

export async function authenticate({
    env,
    request,
    url = null,
    requiredPermission = null,
    authScope = AUTH_SCOPE.EITHER,
}) {
    const securityConfig = await fetchSecurityConfig(env);
    const userAuthCode = securityConfig.auth.user.authCode;
    const authCodeConfigured = !!(userAuthCode && userAuthCode.trim());

    const db = getDatabase(env);
    const tokenResult = await validateApiToken(request, db, requiredPermission);
    if (tokenResult.valid) {
        return AUTHORIZED('admin');
    }

    const userCtx = { env, request, url, authCodeConfigured, userAuthCode };

    if (authScope === AUTH_SCOPE.ADMIN) {
        return await checkAdmin();
    }

    if (authScope === AUTH_SCOPE.USER) {
        return await checkUser(userCtx);
    }

    const adminResult = await checkAdmin();
    if (adminResult?.authorized) return adminResult;

    return await checkUser(userCtx);
}

function extractAuthCode(url, request) {
    let authCode = url.searchParams.get('authCode');

    if (!authCode) {
        const referer = request.headers.get('Referer');
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                authCode = new URLSearchParams(refererUrl.search).get('authCode');
            } catch (e) {
                console.error('Invalid referer URL:', e);
            }
        }
    }

    if (!authCode) {
        authCode = request.headers.get('authCode');
    }

    if (!authCode) {
        const cookies = request.headers.get('Cookie');
        if (cookies) {
            const match = cookies.match(new RegExp('(^| )authCode=([^;]+)'));
            authCode = match ? decodeURIComponent(match[2]) : null;
        }
    }

    return authCode;
}
