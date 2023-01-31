import { FastifyInstance } from 'fastify';
import dayjs from 'dayjs';
import { z } from 'zod'
import { prisma } from '../prisma';

export async function AppRouter(app: FastifyInstance) {

    app.post("/habits", async (req, res) => {
        const requestBodySchema = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(7)
            )
        });

        const { title, weekDays } = requestBodySchema.parse(req.body);

        const date = dayjs().startOf("day").toDate()

        await prisma.habit.create({
            data: {
                title: title,
                created_at: date,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay,
                        }
                    })
                }
            }
        })

        return res.send("Ok")
    })

    app.get("/day", async (req, res) => {
        const requestBodySchema = z.object({
            date: z.coerce.date()
        });

        const { date } = requestBodySchema.parse(req.query)

        const parsedDate = dayjs(date).startOf("day")
        const weekDay = parsedDate.get("day")

        const habitsOfDay = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where:{
                date:parsedDate.toDate()
            },
            include:{
                dayHabits:true
            },
        });

        const completehabits = day?.dayHabits.map(habit => {
            return habit.habit_id
        })

        return {
            habitsOfDay,
            completehabits
        }
    })
}

