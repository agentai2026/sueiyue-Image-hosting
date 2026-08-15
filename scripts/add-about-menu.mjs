import fs from 'fs'

const menuFile = 'frontend-dist/js/22.b436b08e.js'
const appFile = 'frontend-dist/js/app.a596d0f1.js'

let menu = fs.readFileSync(menuFile, 'utf8')
const oldOptions =
  'pageOptions(){return[{name:"dashboard",icon:"images",label:"dashboardTabs.fileManagement"},{name:"systemConfig",icon:"cogs",label:"dashboardTabs.systemSettings"},{name:"",icon:"upload",label:"dashboardTabs.fileUpload"}]}'
const newOptions =
  'pageOptions(){return[{name:"dashboard",icon:"images",label:"dashboardTabs.fileManagement"},{name:"systemConfig",icon:"cogs",label:"dashboardTabs.systemSettings"},{name:"",icon:"upload",label:"dashboardTabs.fileUpload"},{name:"about",icon:"circle-info",label:"dashboardTabs.about"}]}'

if (!menu.includes(oldOptions)) {
  console.error('pageOptions pattern not found')
  process.exit(1)
}
menu = menu.replace(oldOptions, newOptions)

const oldClick =
  'handleTabClick(e){this.closePageMenu(),e!==this.activeTab?this.$router.push(`/${e}`):this.refreshDashboard()}'

const aboutHtml = [
  '<div style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(15,18,22,.45);backdrop-filter:blur(8px);padding:24px">',
  '<div style="width:min(420px,100%);border-radius:20px;background:rgba(255,255,255,.92);box-shadow:0 24px 80px rgba(0,0,0,.18);padding:28px 26px 22px;color:#1c2228;font-family:system-ui,-apple-system,sans-serif">',
  '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">',
  '<img src="/static/media/logo.png" alt="" width="56" height="56" style="border-radius:14px"/>',
  '<div><div style="font-size:1.25rem;font-weight:700;letter-spacing:.04em">岁月图床</div>',
  '<div style="font-size:.85rem;opacity:.65;margin-top:2px">Sueiyue Image Hosting</div></div></div>',
  '<p style="line-height:1.7;font-size:.95rem;opacity:.84;margin:0 0 12px">个人图床服务，支持上传、管理与外链分享。基于 Cloudflare Workers 构建。</p>',
  '<p style="line-height:1.65;font-size:.86rem;opacity:.7;margin:0 0 18px">站点：img.sueiyue.cn<br/>备用：sueiyue.agentai2026.workers.dev</p>',
  '<button data-close type="button" style="width:100%;height:42px;border:0;border-radius:999px;background:#1c2228;color:#fff;font-weight:600;cursor:pointer">知道了</button>',
  '</div></div>',
].join('')

const newClick =
  'handleTabClick(e){if(this.closePageMenu(),"about"===e){let t=document.getElementById("sueiyue-about-modal");' +
  'if(!t){t=document.createElement("div");t.id="sueiyue-about-modal";t.innerHTML=' +
  JSON.stringify(aboutHtml) +
  ';document.body.appendChild(t);t.addEventListener("click",e=>{e.target!==t&&!e.target.closest("[data-close]")||t.remove()})}return}' +
  'e!==this.activeTab?this.$router.push(`/${e}`):this.refreshDashboard()}'

if (!menu.includes(oldClick)) {
  console.error('handleTabClick pattern not found')
  process.exit(1)
}
menu = menu.replace(oldClick, newClick)
fs.writeFileSync(menuFile, menu)
console.log('patched', menuFile)

let app = fs.readFileSync(appFile, 'utf8')
const zhOld =
  '"dashboardTabs":{"fileManagement":"文件管理","userManagement":"用户管理","systemSettings":"系统设置","fileUpload":"文件上传"}'
const zhNew =
  '"dashboardTabs":{"fileManagement":"文件管理","userManagement":"用户管理","systemSettings":"系统设置","fileUpload":"文件上传","about":"关于"}'
const enOld =
  '"dashboardTabs":{"fileManagement":"File Management","userManagement":"User Management","systemSettings":"System Settings","fileUpload":"File Upload"}'
const enNew =
  '"dashboardTabs":{"fileManagement":"File Management","userManagement":"User Management","systemSettings":"System Settings","fileUpload":"File Upload","about":"About"}'

if (!app.includes(zhOld) || !app.includes(enOld)) {
  console.error('i18n patterns not found')
  process.exit(1)
}
app = app.replaceAll(zhOld, zhNew).replaceAll(enOld, enNew)
fs.writeFileSync(appFile, app)
console.log('patched', appFile)
console.log('done')
