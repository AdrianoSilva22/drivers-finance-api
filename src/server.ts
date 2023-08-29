import express from 'express'
import cors from 'cors'
import usuario from './routes/usuario'

const app = express()

app.use(cors())

app.use(express.json())

app.use('/usuario', usuario)

const port = 3003
app.listen(port, () => console.log(`funcionando na porta ${port}`))

export default app

