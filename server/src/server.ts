import Fastify from 'fastify'
import cors from '@fastify/cors'
import { AppRouter } from './routers/exa.routes'

const app = Fastify()
let port = 3333

app.register(cors)
app.register(AppRouter)



app.listen({port}, () => console.log(`API rodando na porta ${port}`))