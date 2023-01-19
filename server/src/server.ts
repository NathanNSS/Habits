import Fastify from 'fastify'
import cors from '@fastify/cors'

const app = Fastify()
let port = 3333

app.register(cors)

app.get("/", (req, res)=>{
    
    return res.send("Ok")
})

app.listen({port}, () => console.log(`API rodando na porta ${port}`))