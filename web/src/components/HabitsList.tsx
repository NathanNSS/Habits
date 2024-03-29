import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { Api } from '../connection/api';

interface IHabitsList{
    date: Date
    isLoading: (state:boolean)=>void
    onCompletedChanged: (completed: number)=> void
}

interface HabitsInfo {
    habitsOfDay: Array<{
      id: string;
      title: string;
      created_at: string
    }>;
    completedHabits: string[]
}

export function HabitsList({date, isLoading, onCompletedChanged}:IHabitsList) {

    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

    async function getHabit(dateOfDay: Date){
        try{
            isLoading(true)
            const {data} = await Api.get<HabitsInfo>("/day",{
                params:{
                    date: dateOfDay.toISOString()
                }
            })

            setHabitsInfo(data)

        }catch(error){
            console.log(error)
        }finally{
            isLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string) {
        try{
            isLoading(true)
            const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
          
            await Api.patch(`/habits/${habitId}/toggle`)
        
            let completedHabits: string[] = []
        
            if(isHabitAlreadyCompleted) {
              completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
            } else {
              completedHabits = [...habitsInfo!.completedHabits, habitId]
            }
        
            setHabitsInfo({
                habitsOfDay: habitsInfo!.habitsOfDay,
              completedHabits
            })
        
            onCompletedChanged(completedHabits.length)
        }catch(error){
            console.log(error)
        }finally{
            isLoading(false)
        }
      }
    

    useEffect(()=> {
        getHabit(date)
    },[])

   const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    return (
        <div className='mt-6 flex flex-col gap-3'>
            { habitsInfo?.habitsOfDay.map(habit => (
                    <Checkbox.Root
                        key={habit.id}
                        className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                        disabled={isDateInPast}
                        checked={habitsInfo.completedHabits.includes(habit.id)}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                    >
                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors  group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white" weight="bold" />
                            </Checkbox.Indicator>
                        </div>

                        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                            {habit.title}
                        </span>
                    </Checkbox.Root>
                ))
            }

        </div>
    )
}