
import {
    View,
    Text,
    ActivityIndicator,
} from 'react-native';

export function Loading({ padrao }: { padrao?: boolean }) {

    return (
        <>
            {
                padrao ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <ActivityIndicator color="white" size={35} />
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#09090A" }}>
                        <ActivityIndicator color="#7C3AED" size={35} />
                    </View>
            }
        </>
    );
}