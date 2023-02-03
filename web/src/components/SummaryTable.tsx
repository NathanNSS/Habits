import dayjs from "dayjs";
import { useEffect, useState } from "react"

import { HabitDay } from "./HabitDay"
import { Api } from "../connection/api";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates"


type Summary = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]

const summaryDates = generateRangeDatesFromYearStart()

const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

export function SummaryTable() {
    const [summary, setSummary] = useState<Summary>([])


    async function getSummary() {
        try {
            const res = await Api.get<Summary>("/summary")
            setSummary(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getSummary()
    }, [])
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {
                    weekDays.map((weekDay, i) => (
                        <div
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                        >
                            {weekDay}
                        </div>
                    ))
                }
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                    summaryDates.map(date => {

                        const dayInSummary = summary.find(data => {
                            return dayjs(date).isSame(data.date, "day")
                        })

                        return (
                            <HabitDay
                                key={date.toString()}
                                date={date}
                                amount={dayInSummary?.amount}
                                completed={dayInSummary?.completed}
                            />

                        )
                    })
                }

                {
                    amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                        <div
                            key={`${i}:${Math.random()}`}
                            className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg  opacity-40 cursor-not-allowed"
                        />
                    ))
                }
            </div>
        </div>
    )
}