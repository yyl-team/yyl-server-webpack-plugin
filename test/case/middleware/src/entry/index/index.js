import axios from 'axios'
import './index.css'
console.log('hello plugin')

axios.get('//www.yy.com/yyweb/module/data/header').then((rs) => {
  console.log(rs)
})

console.log('http://www.yy.com/yyweb/module/data/header')
console.log('https://www.yy.com/yyweb/module/data/header')
