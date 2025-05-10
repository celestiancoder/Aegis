"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createAccount } from '@/lib/actions/user.actions'
import OTPModal from './OTPModal'
import { signInUser } from '@/lib/actions/user.actions'



type FormType="sign-in"|"sign-up"

const authFormSchema =(formType:FormType)=>{
  return z.object({
    email:z.string().email(),
    fullName:formType==="sign-up"?z.string().min(2).max(50):z.string().optional(),
  })
}

const AuthForm = ({type}:{type:FormType}) => {

  const[isLoading,setIsLoading]=useState(false)
  const [errorMessage,setErrorMessage]=useState('')
  const [accountId,setAccountId]=useState(null)
  
  const formSchema=authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",email:'',
    },
  })
 
 
  const onSubmit=async(values: z.infer<typeof formSchema>) =>{
     setIsLoading(true);
     setErrorMessage("")
     try{

     const user=
     type==="sign-up"? await createAccount({
      fullName:values.fullName || "",
      email:values.email,}) : await signInUser({email:values.email})
      
     

     setAccountId(user.accountId)
    }catch{
      setErrorMessage('Failed to create account.Please try again')
    } finally{
      setIsLoading(false)
     
    }
  }
  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[800px] w-4/5 max-w-[400px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8 ">
      <h1 className='text-5xl text-purple-300 text-center font-extrabold'>Aegis</h1>
      <h1 className='text-[34px] leading-[42px] font-bold text-center md:text-left'>{type==="sign-in"?"Sign In":"Sign Up" }</h1>
        {type==="sign-up" && (<FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>

              <div className='flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 drop-shadow-sm'>
              <FormLabel className='font-light pt-2 body-2 '>Username</FormLabel>

              <FormControl>
                <Input placeholder="Enter your full name" className='border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 body-2' {...field} />
              </FormControl>
              </div>
              
              
              
              <FormMessage className=' ml-4' />
            </FormItem>
          )}
        />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>

              <div className='flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 drop-shadow-sm'>
              <FormLabel className=' pt-2 body-2 font-light'>Email</FormLabel>

              <FormControl>
                <Input placeholder="Enter your email" className='border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 body-2' {...field} />
              </FormControl>
              </div>
              
              
              
              <FormMessage className=' ml-4' />
            </FormItem>
          )}
        />
        <Button type="submit" className='h-[50px] bg-[#0B1940] hover:bg-purple-300 transition-all rounded-full button cursor-pointer' disabled={isLoading}>{type==="sign-in"?"Sign In":"Sign Up" }
          {isLoading && (
            <div style={{ display: "flex", gap: "8px" }}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
                animate={{
                  y: ["0%", "-150%", "0%"], 
                }}
                transition={{
                  duration: 0.8, 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  delay: index * 0.2, 
                }}
              />
            ))}</div>
          )}
        </Button>
        {errorMessage && (
          <p className='mx-auto w-fit rounded-xl bg-error/5 px-8 py-4 text-center text-error text-red-500'>*{errorMessage}</p>
        )}
        <div className='flex justify-center'>
          <p className='opacity-30'>
            {type==="sign-in"
            ?"Don't have an account?":"Already have an account?"} 
          </p>
          <Link href={type==="sign-in"?"/sign-up":"sign-in"}>{type==="sign-in"?"Sign-Up":"Sign-In"}</Link>
        </div>
      </form>
    </Form>

    {accountId && <OTPModal email={form.getValues("email")} accountId={accountId} />}
    </>
  )
  
}

export default AuthForm