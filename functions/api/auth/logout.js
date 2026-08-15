/**
 * 登出接口 — 鉴权已移除，恒成功
 */
export async function onRequestPost(_context) {
    return new Response('Logged out', { status: 200 });
}
