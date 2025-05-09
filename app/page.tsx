import Navbar from "@/components/navbar/navbar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";

const Home=async()=> {
  const currentUser=await getCurrentUser()
  if(!currentUser) return redirect("/")
  return (
    <div>
      <div className="min-h-screen bg-white">
        <Navbar {...currentUser}/>
        <div className="pt-60 px-4 md:px-20"> 
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
            
            <div className="order-1 flex flex-col justify-center">
              <div className="font-extrabold h-48 flex items-center text-4xl md:text-6xl">
                YOUR BEST HELPER
              </div>
              <div className="flex justify-center md:justify-start">
                <div className="inline-block px-6 py-3 rounded-full border-2 border-gray-800 bg-white  transition-colors cursor-pointer text-lg font-medium hover:scale-110">
                  <Link href="/">Try it out</Link>
                </div>
              </div>
            </div>
            
           
            <div className="order-2 md:order-2 flex items-center">
              <p className="text-lg text-gray-700">
                description
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;