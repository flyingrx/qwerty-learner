import recordRoutes from './routes/recordRoutes'
import cors from 'cors'
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', recordRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
