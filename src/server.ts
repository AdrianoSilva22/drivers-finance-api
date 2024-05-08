import cors from 'cors'
import express from 'express'
import * as dotenv from "dotenv"
import { DriverRouter } from './routes/driver'

const app = express()

const PORT = parseInt(process.env.PORT || '8085', 10)

app.use(cors())

dotenv.config()

app.use(express.json())

app.use(new DriverRouter().getRouter())

app.listen(PORT, () => console.log(`funcionando na porta ${PORT}`))