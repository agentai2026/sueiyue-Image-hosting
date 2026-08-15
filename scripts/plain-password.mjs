import fs from 'fs'

// User login page
let login = fs.readFileSync('frontend-dist/js/63.503c70e6.js', 'utf8')
const oldUser =
  'this.loginFields=[{key:"password",label:this.$t("login.password"),placeholder:this.$t("login.passwordPlaceholder"),type:"password",showPassword:!0,icon:"Lock"}]'
const newUser =
  'this.loginFields=[{key:"password",label:this.$t("login.password"),placeholder:this.$t("login.passwordPlaceholder"),type:"text",showPassword:!1,icon:"Lock"}]'

if (!login.includes(oldUser)) {
  // try without showPassword exact
  console.log('exact not found, searching...')
  const i = login.indexOf('login.passwordPlaceholder')
  console.log(login.slice(i - 80, i + 120))
  process.exit(1)
}
login = login.replace(oldUser, newUser)
fs.writeFileSync('frontend-dist/js/63.503c70e6.js', login)
console.log('patched user login')

// Also patch BaseLogin if it forces password type
for (const f of fs.readdirSync('frontend-dist/js').filter((x) => x.endsWith('.js'))) {
  const s = fs.readFileSync('frontend-dist/js/' + f, 'utf8')
  if (!s.includes('showPassword') || !s.includes('BaseLogin')) continue
  if (f === '63.503c70e6.js') continue
  console.log('also has BaseLogin/showPassword:', f)
}
