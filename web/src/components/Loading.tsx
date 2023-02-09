
 
export function Loading({color}: {color?: string}){
    
    return(
            <div className={`w-5 h-5 border-4 border-${color ? `[${color}]`: 'violet-500' } rounded-full border-r-transparent animate-spin`}/>

    )
}   