"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'  
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);

  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);

  const [jsonResponse, setJsonResponse] = useState([]);
  const {user}=useUser();

  const router = useRouter();

 const onSubmit=async(e)  => {
    setLoading(true);
    e.preventDefault();
    // submit the form
    console.log('jobPosition:', jobPosition);
    console.log('jobDesc:', jobDesc);
    console.log('jobExperience:', jobExperience);   
    
    const InputPrompt="Job Position:"+jobPosition+" Job Experience:"+jobExperience+" Job Description:"+jobDesc+", depending on job position, job description and job experience give us 5 interview questions along with answers in json format. give us question and answer field on json and give json only. Prototype will be Array not an Object."

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
    console.log(JSON.parse(MockJsonResp));
    ////////////////////////////////////////////////////////////////
    setJsonResponse(MockJsonResp);

    if(MockJsonResp)
    {
    const resp=await db.insert(MockInterview)
    .values({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPosition,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
    }).returning({mockId:MockInterview.mockId});
    console.log('Inserted ID:', resp);
    if(resp)
    {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
    }
    }
    else
    {
        console.log('ERROR');
    }
    setLoading(false);
    // console.log('result:', result.response.text());
 }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className='max-w-xl'>
            <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>
                    <h2>Add Details about your job position/role, job description and years of experience </h2>

                    <div className='mt-7 my-3'>
                        <label>Job role/position</label>
                        <Input placeholder='Ex. AI Engineer' required
                        onChange={(event)=>setJobPosition(event.target.value)}/>
                    </div>
                    <div className='my-3'>
                        <label>Job Description/Tech Stack (In Short)</label>
                        <Textarea placeholder='Ex. Python, Tensorflow, etc' required
                        onChange={(event)=>setJobDesc(event.target.value)}/>
                    </div>
                    <div className='my-3'>
                        <label>Years of Experience</label>
                        <Input placeholder='Ex. 1' type="number" max="50" required
                        onChange={(event)=>setJobExperience(event.target.value)}/>
                    </div>   
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button variant='ghost' type='button' onClick={()=>setOpenDialog(false)}
                    >Cancel</Button>
                    <Button type='submit' disabled={loading}>
                        {loading?
                        <>
                        <LoaderCircle className='animate-spin'/>'Generating from AI'
                        </>: 'Start Interview'}
                        </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview