import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
function App() {

  const [note, setnote] = useState([])

useEffect(() => {
  getData()
}, [])

const [editId, seteditId] = useState(null)

function getData(){
  axios.get("http://localhost:3000/api/notes")
  .then((raw)=>{
    setnote(raw.data.notes)
  })
}

function handleSubmit(e){
  e.preventDefault()

  console.log(e);
  

  const title = e.target[0].value
  const description = e.target[1].value

  axios.post("http://localhost:3000/api/notes" ,{
    title: title,
    description: description
  })
  .then(()=>{
        getData()
        e.target.reset()

  })
  

}


function deleteData(noteId){
  

  axios.delete("http://localhost:3000/api/notes"+noteId)
  .then(()=>{
     getData()
  })
  
}


function Update(e,noteId){
   

  const formdata = new FormData(e.target)

  const title = formdata.get("title")
  const description = formdata.get("description")

  axios.patch("http://localhost:3000/api/notes"+note,{
   title,
   description
  })
  .then((data)=>{
    seteditId(null)
    getData()
  })
}



  return (
    <>

    <div className='py-4 px-4'>
      <form onSubmit={(e)=>{
          handleSubmit(e)
          
      }} >
        <input name='title' type="text" />
        <input name='description' type="text" />
        <button>Submit</button>
      </form>
    </div>

      <div className='px-2 py-3  w-full flex gap-2 flex-wrap items-center justify-center'>
        {
          note.map((e)=>{
            return(
              <div key={e._id} className='bg-orange-400 w-fit px-8 py-10 rounded-xl flex items-center justify-center flex-col gap-1'>
                {
                  editId === e._id?(
                    <form key={e._id} onSubmit={(data)=>{
                      Update(data,e._id)
                    }}>
                      <input type="text" defaultValue={e.title} />
                      <input type="text"defaultValue={e.description} />
                      <button type='submit'>Edit</button>
                    </form>
                  ):(
                    <>
                     <h2 className='text-2xl'>Title : {e.title}</h2>
          <h2 className='text-2xl'>Description : {e.description}</h2>

          <div className='flex  justify-between w-full pt-4'>
            <div className="edit ">
              <button
              onClick={(data)=>{
                seteditId(data,e._id)
              }}
              >edit</button>
            </div>
            <div className="delete bg-red-600 px-5 py-1.5 rounded-lg text-white active:scale-98 hover:bg-red-700 cursor-pointer">
              <button onClick={()=>{
                  deleteData(e._id)
              }}
               className='cursor-pointer'>Delete</button>
            </div>
          </div>
                    
                    </>
                  )
                }
         
        </div>
            )
          })
        }

      </div>
    </>
  )
}

export default App
