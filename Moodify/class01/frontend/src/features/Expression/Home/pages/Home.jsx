import React from 'react'
import FaceExpression from "../../components/FaceExpression"
import Player from '../components/Player'
import { useSong } from '../hook/useSongs'

const Home = () => {

    const {handlegetSongs} = useSong()
  return (
    <>
    <FaceExpression onClick={(emotion)=>{handlegetSongs({mood: emotion})}}/>
    <Player/>
    </>
  )
}

export default Home