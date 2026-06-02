import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import markdown from 'react-markdown'
import Markdown from 'react-markdown'
import Prism from 'prismjs'


function Massage({massage}) {

useEffect(()=>{
  Prism.highlightAll()
},[massage.content])



  return (
    <div>
      { massage.role === 'user' ? (
        <div className='flex item-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
          <p className='text-sm dark:text-primary'>{massage.content} </p>
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(massage.timestamp).fromNow() }</span>
          </div>
          <img src={assets.user_icon} alt='' className='w-8 rounded-full'/>
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md my-4'>
            {massage.isImage ? (
              <img src={massage.content} alt='' className='w-full max-w-md mt-2'/>
            ):(
              <div className='text-sm dark:text-primary reset-tw'>
               <Markdown>{massage.content}</Markdown> 
                </div>
            )}
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(massage.timestamp).fromNow() }</span>
        </div>
      )}
    </div>
  )
}

export default Massage
