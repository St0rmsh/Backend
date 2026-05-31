import React from 'react'

const Asidenav = () => {
  return (
    <div>
        <div className='flex flex-col gap-1'>
            <h1 className='text-xl font-bold text-[var(--text-primary)]'>team-sync</h1>
            <p className='text-xs text-[var(--text-secondary)]'>Sync your team's work</p>
        </div>
        <ul>
            <li className='text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:bg-[var(--primary-container)]'>Dashboard</li>
        </ul>
    </div>
  )
}

export default Asidenav