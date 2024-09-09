"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import React, { useEffect } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

function Feedback({params}) {

  const [feedbackList, setFeedbackList] = useState([]);
  const rounter=useRouter();

  useEffect(()=>{
    GetFeedback();
  }, [])

  const GetFeedback = async() =>{
    const result = await db.select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, params.interviewId))
    .orderBy(UserAnswer.id);

    setFeedbackList(result);
  }

  return (
    <div className='p-10'>
        {/* <h2 className='text-2xl font-bold text-black'>Interview Feedback:</h2>
        <h2 className='text-slate-500 text-lg my-3'>Overall Interview Rating: 
            <strong></strong>
         </h2> */}
        {feedbackList?.length == 0 ?
        <h2 className='font-bold text-xl text-green-500'>No Feedback found for this Interview</h2>
        :
        <>
        <h2 className='text-sm text-gray-500' >Sample Correct Answer, Your Answer and Feedback for improvement</h2>
        {feedbackList && feedbackList.map((item, idx)=>(
            <Collapsible key={idx} className='mt-7'>
            <CollapsibleTrigger 
            className='p-2 bg-gray-500 rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
            {item.question}<ChevronsUpDown className='h-5 w-5'/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating</strong>{item.rating}</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer</strong>{item.userAns}</h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer</strong>{item.correctAns}</h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback</strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        </>
        }
        <Button onClick={()=>rounter.replace('/dashboard')}>Go Home</Button>

    </div>
  )
}

export default Feedback