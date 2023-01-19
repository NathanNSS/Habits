import {
   View,
   Text,
} from 'react-native'; 

export function Home(){
   return(
       <View style={{flex:1,backgroundColor:"#09090A", justifyContent:"center", alignItems:"center"}}>
            <Text style={{color:"#fff", fontFamily:"Inter_800ExtraBold"}}>Hello Word</Text>
       </View>
   );
}