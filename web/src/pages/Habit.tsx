import {Header} from '../components/Header'
import { SummaryTable } from '../components/SummaryTable'



export default function Habit() {
    return (
        <div className="h-screen w-screen flex justify-center items-center ">
            <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
                <Header/>
                <SummaryTable/>
            </div>
        </div>
    )
}
