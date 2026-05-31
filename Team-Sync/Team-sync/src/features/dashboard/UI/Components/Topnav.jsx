import React from 'react'
import { Bell,Menu, Search } from 'lucide-react'

const Topnav = () => {
  return (
    <div className='flex justify-between items-center w-full'>
        <div className='flex items-center gap-2 border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-surface)] w-[40%]'>
            <Search size={23} className='text-[var(--text-muted)]'/>
            <input type="text" placeholder='Search workspace' className='outline-none w-full bg-transparent outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)] w-full' />
        </div>
        <div className='flex gap-3'>
            <Bell  size={23} className='text-[var(--text-primary)] cursor-pointer'/>
            <Menu  size={23} className='text-[var(--text-primary)] cursor-pointer'/>
        </div>
    </div>
  )
}

export default Topnav