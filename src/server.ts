import cors from 'cors'
import express from 'express'
import driver from './routes/driver'
import expense from './routes/expense'
import income from './routes/income'
const app = express()

app.use(cors())

import * as dotenv from "dotenv"
dotenv.config()

app.use(express.json())

app.use('/driver', driver)
app.use('/income', income)
app.use('/expense', expense)


const port = 3003
app.listen(port, () => console.log(`funcionando na porta ${port}`))


