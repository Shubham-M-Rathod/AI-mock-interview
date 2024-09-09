import { UserButton } from '@clerk/nextjs'
import AddNewInterview from './_components/AddNewInterview'
import React from 'react'
import InterviewList from './_components/InterviewList'

function DashboardPage() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>DashboardPage</h2>
      <h2 className='text-gray-500'>Create and Start Your AI Mockup Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
      <AddNewInterview/>
      </div>

      {/* previous interview */}
      <InterviewList/>

    </div>
  )
}

export default DashboardPage