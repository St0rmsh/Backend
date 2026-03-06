import { useContext } from "react";
import { SongContext } from "../Song.context";
import {getSongs} from "../services/song.api"



export const useSong = ()=>{

    const context = useContext(SongContext)

    const {song,setSong,loading,setloading} = context


    const handlegetSongs = async({mood})=>{
        setloading(true)

        try {
            const response = await getSongs({mood})
            
            setSong(response.song)

        } catch (error) {
            console.log(error);
            
        } finally{
            setloading(false)
        }
    }


    return {song,loading,handlegetSongs}
}

