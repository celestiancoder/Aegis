import React from 'react'
import { Button } from './ui/button'
import { logoutAction } from '@/lib/actions/logout'

const Logoutform = () => {
  return (
    <div>
      <form action={logoutAction}>
        <Button type='submit' className='flex-center  h-[52px] min-w-[67px] items-center rounded-xl bg-amber-500 p-0 text-brand shadow-none transition-all hover:bg-amber-300 cursor-pointer'>
                Log-out
        </Button>
      </form>
    </div>
  )
}

export default Logoutform
