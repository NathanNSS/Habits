import { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { ProgressBar } from "../components/ProgressBar";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";

import { Api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    habitsOfDay: Array<{
        id: string;
        title: string;
    }>;
}


export function Habit() {
    const [loading, setLoading] = useState(false)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)

    const { date } = useRoute().params as Params

    const parsedDate = dayjs(date)
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const amountOfHabits = dayInfo?.habitsOfDay.length ?? 0
    const amountCompleted = dayInfo?.completedHabits.length ?? 0

    const percentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0

    async function fetchHabits() {
        try {
            setLoading(true)

            const res = await Api.get<DayInfoProps>("/day", {
                params: {
                    date: date
                }
            })
            
            setDayInfo(res.data)
        } catch (error) {
            console.log(error)
            Alert.alert("‼ Ops", "Não foi possível carregar as informações dos hábitos")
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabits(habitId: string) {
        try {
            await Api.patch(`/habits/${habitId}/toggle`)

            if (dayInfo && dayInfo?.completedHabits.includes(habitId)) {
                setDayInfo({
                    habitsOfDay: dayInfo.habitsOfDay,
                    completedHabits: dayInfo.completedHabits.filter(item => item != habitId)
                })
            } else {
                setDayInfo(preState => {
                    return {
                        habitsOfDay: preState!.habitsOfDay,
                        completedHabits: [...preState!.completedHabits, habitId]
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }


    }

    useEffect(() => {
        fetchHabits()
    }, [])

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />
                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                {
                    loading ?
                        <Loading />
                        :
                        <>
                            <ProgressBar progress={percentage} />

                            <View className="mt-6">

                                {dayInfo?.habitsOfDay.length ?
                                    dayInfo?.habitsOfDay.map(habit => (
                                        <CheckBox
                                            key={habit.id}
                                            title={habit.title}
                                            checked={dayInfo.completedHabits.includes(habit.id)}
                                            onPress={() => handleToggleHabits(habit.id)}
                                            disabled={isDateInPast}
                                        />
                                    ))
                                    :
                                    <HabitsEmpty/>

                                }
                            </View>
                        </>
                }


            </ScrollView>
        </View>
    )
}