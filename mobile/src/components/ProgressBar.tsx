import { useEffect } from 'react';
import { View, Text } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from 'react-native-reanimated';

interface Props {
    progress?: number;
}

export function ProgressBar({ progress = 0 }: Props) {

    const sharedProgress = useSharedValue(progress);
    
    const style = useAnimatedStyle(() => {
      return {
        width: `${sharedProgress.value}%`
      }
    })
  
    useEffect(() => {
      sharedProgress.value = withTiming(progress)
    }, [progress])

    return (
        <View className="w-full h-4 rounded-xl bg-zinc-700 mt-4">
            <Animated.View
                className="h-4 rounded-xl bg-violet-600"
                style={style}
            />
            <Text className="absolute text-gray-200 text-xs left-1/2 -translate-x-1/2">
                {progress}%
            </Text>
        </View>
    )
}