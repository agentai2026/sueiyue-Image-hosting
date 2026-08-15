import fs from 'fs'
const app = fs.readFileSync('frontend-dist/js/app.a596d0f1.js', 'utf8')
console.log('dashboard redirect', app.includes('path:"/dashboard",name:"dashboard",redirect:"/"'))
console.log('systemConfig redirect', app.includes('path:"/systemConfig",name:"systemConfig",redirect:"/"'))
console.log('blockimg redirect', app.includes('path:"/blockimg",name:"blockimg",redirect:"/"'))
const u = fs.readFileSync('frontend-dist/js/253.8851e7fa.js', 'utf8')
console.log('manage btn gone', !u.includes('upload.manage'))
console.log('handleManage empty', u.includes('handleManage(){}'))
