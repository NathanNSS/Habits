import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import colors from "tailwindcss/colors";
import { Feather } from '@expo/vector-icons'

import { Api } from "../lib/axios";

import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function New() {
    const [title, setTitle] = useState("")
    const [weekDays, setWeekDays] = useState<number[]>([])

    const [loading, setLoading] = useState(false)

    function changeWeekDays(day: number) {
        if (weekDays.includes(day)) {
            setWeekDays(weekDays.filter(weekDay => weekDay !== day))
        } else {
            setWeekDays([...weekDays, day]);
        }
    }

    async function setNewHabits() {
        try {
            setLoading(true)
            if (title.trim().length > 0 || weekDays.length > 0) {

                await Api.post("habits", {
                    title: title,
                    weekDays: weekDays,
                })

                setTitle("")
                setWeekDays([])

                Alert.alert("Habito Criado ✔")

            } else {
                Alert.alert("‼ Ops", "Informe o nome do hábito e escolha a periodicidade.")
                throw Error("Informe o nome do hábito e escolha a periodicidade.")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-white font-semibold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Exercicios, Dormir bem, etc..."
                    placeholderTextColor="#a1a1aa"
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>


                {
                    availableWeekDays.map((availableDays, i) => (

                        <CheckBox
                            key={`${availableDays}-` + i}
                            title={availableDays}
                            onPress={() => changeWeekDays(i)}
                            checked={weekDays.includes(i)}
                        />
                    ))
                }

                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={setNewHabits}
                >
                    {loading ?
                        <Loading padrao />
                        :
                        <>
                            <Feather
                                name="check"
                                size={20}
                                color={colors.white}
                            />

                            <Text className="font-semibold text-base text-white ml-2">
                                Confirmar
                            </Text>
                        </>

                    }
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}