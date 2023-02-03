import { View, Text } from 'react-native'

interface Props {
    progress?: number;
}

export function ProgressBar({ progress = 0 }: Props) {
    return (
        <View className="w-full h-4 rounded-xl bg-zinc-700 mt-4">
            <View
                className="h-4 rounded-xl bg-violet-600"
                style={{ width: `${progress}%` }}
            />
            <Text className="absolute text-gray-200 text-xs left-1/2 -translate-x-1/2">
                {progress}%
            </Text>
        </View>
    )
}