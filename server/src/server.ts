import Fastify from 'fastify'
import cors from '@fastify/cors'
import { AppRouter } from './routers/exa.routes'

const app = Fastify()
let port = 3333

app.register(cors)
app.register(AppRouter)


// Adição de ( host:"0.0.0.0" ) para funcionar no android no React Native
app.listen({port, host:"0.0.0.0"}, () => console.log(`API rodando na porta ${port}`))