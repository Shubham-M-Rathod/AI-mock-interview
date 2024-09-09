"use client"
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {

    const [interviewList, setInterviewList] = useState([]);
    useEffect(()=>
    {
        user&&GetInterviewList();   
    }, [user])

    const user=useUser();
    const GetInterviewList  = async() => 
    {
        const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .order(desc(MockInterview.id));

        setInterviewList(result);   
    }

  return (
    <div>
        <h2 className='font-medium text-xl'>Previous Interview</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {interviewList&&GetInterviewList.map((item, idx)=>(
                <InterviewItemCard key={idx} interview={item}/>
            ))}
        </div>
    </div>
  )
}

export default InterviewList