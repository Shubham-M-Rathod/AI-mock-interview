"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { chatSession } from '@/utils/GeminiAIModal';
import moment from 'moment';

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
  const [userAnswer, setUserAnswer] = useState('');
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=>{
    results.map((result)=>
    setUserAnswer(prevAns=>prevAns+result?.transcript))
  }, [results])

  useEffect(()=>
  {
    if(!isRecording && userAnswer.length > 10)
    UpdateUserAnswer();
  }, [userAnswer])

  const StartStopRecording = async() => {
    stopSpeechToText();
    if(isRecording) {
      stopSpeechToText();
    }
    else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async() => {
      setLoading(true);
      const feedbackPrompt = 'Question:' + mockInterviewQuestion[activeQuestionIndex]?.question + ", User Answer:" + userAnswer + ", depending upon the question and user answer for given interview please give us rating from 0 to 5 and feedback as area of improvement if any in just 3 to 5 lines in JSON format with rating field and feedback field";
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (result.response.text()).replace('```json','').replace('```','')
      console.log(mockJsonResp, userAnswer);
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer).values(
        {
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAnswer:userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        })
        
        if(resp)
        {
          toast('Answer saved successfully');
          setUserAnswer('');  
          setResults([]);
        }
        setResults([]);
        setLoading(false);
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col justinfy-center items-center rounded-lg p-5'>
          <Image src={'/webcam.png'} width={200} height={200} className='absolute my-10'/>
          <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10
          }}
          />
      </div>
      <Button 
      disabled={loading}
      variant='outline' 
      onClick={StartStopRecording} 
      className='my-10'>
        {isRecording? 
        <h2 className='text-red-600'>
          <Mic/>Stop Recording
        </h2>:
        'Record Answer'}
      </Button>
    </div>
  )
}

export default RecordAnswerSection