import { signOutUser } from '@/lib/actions/user.actions'
import React from 'react'
import { Form } from 'react-hook-form'
import { Button } from './ui/button'
import { logoutAction } from '@/lib/actions/logout'

const Logoutform = () => {
  return (
    <div>
      <form action={logoutAction}>
        <Button type='submit' className='flex-center h-[52px] min-w-[54px] items-center rounded-full bg-amber-500 p-0 text-brand shadow-none transition-all hover:bg-amber-300 '>
                Log-out
        </Button>
      </form>
    </div>
  )
}

export default Logoutform
