import { 
    Dimensions, 
    TouchableOpacity, 
    TouchableOpacityProps 
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Props extends TouchableOpacityProps {
    amountOfHabits?: number;
    amountCompleted?: number;
    date: Date;
}

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

export function HabitDay({ date, amountCompleted = 0, amountOfHabits = 0, ...rest }: Props) {

    const percentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today);

    return (
        <TouchableOpacity
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
            {...rest}
            className={clsx(
                "rounded-lg border-2 m-1", {
                ["bg-zinc-900 border-zinc-800"]: percentage === 0,
                ["bg-violet-900 border-violet-700"]: percentage > 0 && percentage < 20,
                ["bg-violet-800 border-violet-600"]: percentage > 20 && percentage < 40,
                ["bg-violet-700 border-violet-500"]: percentage > 40 && percentage < 60,
                ["bg-violet-600 border-violet-500"]: percentage > 60 && percentage < 80,
                ["bg-violet-500 border-violet-400"]: percentage > 80,
                ["border-zinc-200 border-3"]: isCurrentDay,
            }
            )}
        />
    )
}