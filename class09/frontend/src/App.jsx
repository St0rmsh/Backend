import { useEffect, useState } from 'react'

import './App.css'
import axios from 'axios'

function App() {

const [notes, setnotes] = useState([])

useEffect(() => {
  
 Get()
  
}, [])

const [editId, seteditId] = useState(null)


function Get(){
axios.get("http://localhost:3000/api/notes")
 .then((res)=>{
   setnotes(res.data.Notes)
   console.log(res.data.Notes);
   
 })
}

function handleSubmit(e){
  e.preventDefault()

  const {title, description} = e.target
  console.log(title.value, description.value);

  axios.post("http://localhost:3000/api/notes", {
    title:title.value,
    description:description.value
  })
  .then((res)=>{
      Get()
      e.target.reset()

  })
  
}
 
function deleteNote(note){
  axios.delete("http://localhost:3000/api/notes/"+note)
  .then(()=>{
    Get()
  })  

}

function updateNotes(e,note){
  e.preventDefault()

  const formData = new FormData(e.target)
  const title = formData.get("title")
  const description = formData.get("description")
  console.log(title);
  console.log(description);
  
  
  axios.patch("http://localhost:3000/api/notes/"+note,{
    title,
    description

  }).then((res)=>{
    console.log("Updated ", res.data);
    
    seteditId(null)
    Get()
  })
  
}

  return (
    <>
    <main className='min-h-screen px-5 py-10 flex flex-col gap-12 items-center bg-gradient-to-br from-slate-900 via-gray-900 to-black'>

      <div className='bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-14 py-12 rounded-3xl'>
        <form onSubmit={(e)=>{
          handleSubmit(e)
        }} className='flex flex-col gap-3'>
          <input className='border border-white/20 bg-transparent text-white px-3 py-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300' name='title' type="text" placeholder='Enter Title' />
          <input className='border border-white/20 bg-transparent text-white px-3 py-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300'  name='description' type="text" placeholder='Enter Description' />
          <button type='submit'  className='bg-blue-400 text-white rounded-2xl text-xl py-2 px-4 active:scale-97 cursor-pointer'>Submit</button>
        </form>
      </div>

      <div className="second flex flex-wrap gap-5">
        {
          notes.map((data)=>{
          return (   <div key={data._id} className='bg-white/10 backdrop-blur-md border border-white/10 shadow-xl px-10 py-8 rounded-2xl flex flex-col gap-5 items-center text-white min-w-[280px]'>
            {
              editId === data._id ? (
              <form key={data._id} onSubmit={(e)=>{
                updateNotes(e,data._id)
              }} className='flex flex-col gap-3 '>
                 <input className='border-2 px-2 py-1.5 rounded-lg text-lg' type="text" name='title' defaultValue={data.title} />
                 <input className='border-2 px-2 py-1.5 rounded-lg text-lg' type="text" name='description' defaultValue={data.description} />
                 <button type='submit' className='bg-red-600 hover:bg-red-700 transition text-white rounded-xl py-2 px-5 active:scale-95'>Update</button>
              </form>
              ):(
          <>
             <h2 className='text-2xl font-semibold tracking-wide'>Title : {data.title}</h2>
            <h4 className='text-gray-300'>Description : {data.description}</h4>
            <div className=' flex justify-between w-full py-2'>
            <button onClick={()=>{
              seteditId(data._id)
            }} className='bg-yellow-500 hover:bg-yellow-600 transition text-black rounded-xl py-2 px-5 active:scale-95'>Update</button>
            <button onClick={()=>{
              deleteNote(data._id);
              
            }} className='bg-red-600 hover:bg-red-700 transition text-white rounded-xl py-2 px-5 active:scale-95'>Delete</button>
          </div>
          </>
              )
            }

          
         </div>
         )
          })
        }
      </div>
    </main>
     
    </>
  )
}



export default App
