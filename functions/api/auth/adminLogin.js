/**
 * 管理员登录接口 — 鉴权已移除，恒成功
 */
export async function onRequestPost(_context) {
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
