import axios from 'axios'
import './index.css'
console.log('hello plugin')

axios.get('//9u9ntpb8xp.api.quickmocker.com/getter-test').then((rs) => {
  console.log(rs)
})

console.log('https://9u9ntpb8xp.api.quickmocker.com/getter-test')
console.log('http://9u9ntpb8xp.api.quickmocker.com/getter-test')
