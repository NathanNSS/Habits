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

        //Fake Delay
        await (() => new Promise<void>((resolve, reject) => {
            setTimeout(resolve,500)
        }))()

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
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            },
        });

        const completedHabits = day?.dayHabits.map(habit => {
            return habit.habit_id
        }) ?? []

         //Fake Delay
         await (() => new Promise<void>((resolve, reject) => {
            setTimeout(resolve,500)
        }))()

        return {
            habitsOfDay,
            completedHabits
        }
    })

    app.patch("/habits/:id/toggle", async (req, res) => {
        
        const bodyRequestSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = bodyRequestSchema.parse(req.params);

        const toDay = dayjs().startOf("day").toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: toDay
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: toDay
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
        
        //Fake Delay
        await (() => new Promise<void>((resolve, reject) => {
            setTimeout(resolve,500)
        }))()
        
        res.status(200).send("Ok")
    })

    app.get("/summary", async (req, res) => {
        const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE
            HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
    `

        return res.status(200).send(summary)
    })
}