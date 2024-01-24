import mysql from 'mysql2/promise'

const connection = mysql.createPool({
  host:'localhost',
  port:3306,
  user: 'root',
  password:'1234',
  database:'drivers_finances'
})

export default connection