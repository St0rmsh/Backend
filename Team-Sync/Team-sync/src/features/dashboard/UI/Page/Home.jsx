import React from 'react'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../../../shared/state/ThemeSlice'

const Home = () => {

  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(toggleTheme())
    console.log("dispatch toggle");
    
  }

  return (
    <div>
        <h1>This is dashboard</h1>
        <button onClick={handleClick} className='bg-slate-400 px-2 rounded-sm'>Toggle Theme</button>
    </div>
  )
}

export default Home