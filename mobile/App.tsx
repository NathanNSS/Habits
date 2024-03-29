import {StatusBar} from 'react-native';
import { 
    useFonts, 
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold,
    Inter_800ExtraBold  
} from '@expo-google-fonts/inter';

import "./src/lib/dayjs"

import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';

export default function App() {
    const [fontsLoaded] = useFonts({Inter_400Regular, Inter_600SemiBold, Inter_700Bold,Inter_800ExtraBold})

    if(!fontsLoaded) return <Loading/>

    return (
        <>
            <StatusBar 
                translucent={true}
                backgroundColor="transparent"
                barStyle='light-content'
            />
            <Routes/>
        </>
    );
}
