import { useState, FormEvent } from 'react'
import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox'

import { Api } from '../connection/api';

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
]

export function NewHabitForm() {
    const [title, setTitle] = useState("")
    const [weekDays, setWeekDays] = useState<number[]>([])

    async function handleSubmitForm(event: FormEvent) {
        event.preventDefault()
        if (title.length <= 0 || weekDays.length === 0) return alert("Prencha todos os campos")

        try {
            const res = await Api.post("/habits", {
                title: title,
                weekDays: weekDays
            })
            setTitle("")
            setWeekDays([])
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    function selectWeekDays(day: number) {
        if (weekDays.includes(day)) {
            setWeekDays(weekDays.filter(weekDay => weekDay !== day))
        } else {
            setWeekDays([...weekDays, day])
        }
    }

    return (
        <form onSubmit={e => handleSubmitForm(e)} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input
                type="text"
                id="title"
                autoFocus
                placeholder="ex: Exercícios, dormir bem, etc..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {
                    availableWeekDays.map((weekDay, i) => (

                        <Checkbox.Root
                            key={weekDay}
                            className='flex items-center gap-3 group'
                            checked={weekDays.includes(i)}
                            onCheckedChange={() => selectWeekDays(i)}
                        >
                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500    '>
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white" weight="bold" />
                                </Checkbox.Indicator>
                            </div>

                            <span className='text-white font-semibold leading-tight'>
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    ))
                }


            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} weight="bold" />
                Confirmar
            </button>
        </form>
    )
}