import fs from 'fs'

// 1) Frontend routes -> redirect admin pages home
let app = fs.readFileSync('frontend-dist/js/app.a596d0f1.js', 'utf8')
const root = app.match(/path:"\/",name:"([^"]+)"/)
const homeName = root ? root[1] : 'home'
console.log('home route:', homeName)

const routeReplacements = [
  [
    '{path:"/dashboard",name:"dashboard",component:()=>Promise.all([t.e(903),t.e(173),t.e(22),t.e(30),t.e(549)]).then(t.bind(t,11017)),beforeEnter:s}',
    '{path:"/dashboard",name:"dashboard",redirect:"/"}',
  ],
  [
    '{path:"/customerConfig",name:"customerConfig",redirect:"/dashboard"}',
    '{path:"/customerConfig",name:"customerConfig",redirect:"/"}',
  ],
  [
    '{path:"/systemConfig",name:"systemConfig",component:()=>Promise.all([t.e(903),t.e(173),t.e(22),t.e(322),t.e(339)]).then(t.bind(t,27339)),beforeEnter:s}',
    '{path:"/systemConfig",name:"systemConfig",redirect:"/"}',
  ],
  [
    '{path:"/adminLogin",name:"adminLogin",redirect:"/dashboard"}',
    '{path:"/adminLogin",name:"adminLogin",redirect:"/"}',
  ],
  [
    '{path:"/blockimg",name:"blockimg",component:()=>Promise.all([t.e(903),t.e(711)]).then(t.bind(t,5215))}',
    '{path:"/blockimg",name:"blockimg",redirect:"/"}',
  ],
  [
    '{path:"/whiteliston",name:"whiteliston",component:()=>Promise.all([t.e(903),t.e(773)]).then(t.bind(t,86569))}',
    '{path:"/whiteliston",name:"whiteliston",redirect:"/"}',
  ],
]

for (const [from, to] of routeReplacements) {
  if (!app.includes(from)) {
    console.error('MISSING:', from.slice(0, 100))
    process.exit(1)
  }
  app = app.replace(from, to)
}
app = app.replaceAll('t({name:"dashboard"})', `t({name:"${homeName}"})`)
fs.writeFileSync('frontend-dist/js/app.a596d0f1.js', app)
console.log('routes redirected')

// 2) Remove manage toolbar button + disable handleManage
let upload = fs.readFileSync('frontend-dist/js/253.8851e7fa.js', 'utf8')
const manageBtn =
  ',(0,s.bF)(k,{disabled:d.disableTooltip||!r.isQuickToolbarOpen,content:e.$t("upload.manage"),placement:"left","hide-after":0,"show-after":1e3},{default:(0,s.k6)(()=>[(0,s.bF)(p,{class:"quick-toolbar-button",onClick:t[3]||(t[3]=e=>d.handleQuickToolbarCommand("manage"))},{default:(0,s.k6)(()=>[(0,s.bF)(u,{icon:"cog",class:"quick-toolbar-icon"})]),_:1})]),_:1},8,["disabled","content"])'
if (!upload.includes(manageBtn)) {
  console.error('manage button vnode not found')
  process.exit(1)
}
upload = upload.replace(manageBtn, '')
upload = upload.replace(
  'handleManage(){this.$router.push("/dashboard")}',
  'handleManage(){}'
)
fs.writeFileSync('frontend-dist/js/253.8851e7fa.js', upload)
console.log('manage button removed')

// 3) Trim dashboard tabs if file still has admin options
let tabs = fs.readFileSync('frontend-dist/js/22.b436b08e.js', 'utf8')
const oldOpts =
  'pageOptions(){return[{name:"dashboard",icon:"images",label:"dashboardTabs.fileManagement"},{name:"systemConfig",icon:"cogs",label:"dashboardTabs.systemSettings"},{name:"",icon:"upload",label:"dashboardTabs.fileUpload"},{name:"about",icon:"circle-info",label:"dashboardTabs.about"}]}'
const newOpts =
  'pageOptions(){return[{name:"",icon:"upload",label:"dashboardTabs.fileUpload"},{name:"about",icon:"circle-info",label:"dashboardTabs.about"}]}'
if (tabs.includes(oldOpts)) {
  tabs = tabs.replace(oldOpts, newOpts)
  fs.writeFileSync('frontend-dist/js/22.b436b08e.js', tabs)
  console.log('pageOptions trimmed')
}

console.log('frontend ok')
