import React from 'react'
import ReactDOM from 'react-dom/client'
import Habit from './pages/Habit'
import "./lib/dayjs"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Habit />
    </React.StrictMode>,
)
