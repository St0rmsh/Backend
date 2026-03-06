import { createContext,useState } from "react";


export const SongContext = createContext()


export const SongProvider = ({children})=>{

    const [song, setSong] = useState({
  "url": "https://ik.imagekit.io/p7b10nfhs/Moodify/songs/ANIMAL__ARJAN_VAILLY___Ranbir_Kapoor___Sandeep_Vanga___Bhupinder_B__Manan_B___Bhushan_K_H2lOGNwwy.mp3",
  "posterUrl": "https://ik.imagekit.io/p7b10nfhs/Moodify/posters/ANIMAL__ARJAN_VAILLY___Ranbir_Kapoor___Sandeep_Vanga___Bhupinder_B__Manan_B___Bhushan_K_aqq3L3Kg_.jpeg",
  "title": "ANIMAL: ARJAN VAILLY | Ranbir Kapoor | Sandeep Vanga | Bhupinder B, Manan B | Bhushan K",
  "mood": "angry",

    })


    const [loading, setloading] = useState(false)



    return(
        <SongContext.Provider value={{song,setSong,loading,setloading}}>
            {children}
        </SongContext.Provider>
    )

}