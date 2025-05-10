import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
        <section className='bg-[#0B1940] justify-center p-20 w-1/2 hidden lg:flex xl:w-2/5 min-h-screen'>
            <div className='text-white space-y-5'>
                
                <h1 className='text-5xl text-purple-300'>Aegis</h1>
                <h1 className='text-3xl'>To find the best way for you</h1>
            </div>
        </section>
        <div className='flex-1 flex justify-center items-center'>
        {children}
      </div>
    </div>
  )
}

export default Layout