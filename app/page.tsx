export const dynamic = 'force-dynamic';
import Navbar from "@/components/navbar/navbar";
import { getCurrentUser } from "@/lib/actions/user.actions";
// import { redirect } from "next/navigation";
import Link from "next/link";


const Home = async () => {
  const currentUser = await getCurrentUser();
  // if (!currentUser) return redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[#0B1940] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 blur-2xl"></div>
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-teal-300/20 blur-2xl"></div>
        <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-2xl"></div>
      </div>
      
      <Navbar {...currentUser} />

      <div className="relative pt-24 px-4 md:px-16 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          <div className="order-1 flex flex-col justify-center space-y-6">
             
            <div className="space-y-2">
              <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                EQUALITY CHAMPIONS
              </h1>
              <p className="text-xl md:text-2xl font-medium text-blue-100">
                Practice combating discrimination with AI
              </p>
            </div>
            <p className="text-lg text-blue-200">
              Train yourself to respond to discriminatory comments, connect with people worldwide, 
              and learn how others handle challenging situations.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="/practice" className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition duration-300 shadow-lg">
                Practice with AI
              </Link>
              <Link href="/chat" className="px-6 py-3 rounded-full border-2 border-blue-300 text-blue-200 font-medium hover:bg-blue-900/30 hover:scale-105 transition duration-300">
                Connect Globally
              </Link>
            </div>
          </div>
         
        </div>
      </div>

      <div className="py-16 px-4 md:px-16 lg:px-20 max-w-7xl mx-auto relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Supporting Sustainable Development Goals</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0C1E4D] p-6 rounded-xl shadow-md hover:shadow-lg transition border border-pink-500/30 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">5</span>
              </div>
              <h3 className="text-2xl font-semibold text-pink-400">Gender Equality</h3>
            </div>
            <p className="text-blue-100">
              Our platform helps you recognize and respond to gender-based discrimination, 
              creating a more inclusive environment for all genders.
            </p>
          </div>
          
          <div className="bg-[#0C1E4D] p-6 rounded-xl shadow-md hover:shadow-lg transition border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">10</span>
              </div>
              <h3 className="text-2xl font-semibold text-purple-400">Reduced Inequalities</h3>
            </div>
            <p className="text-blue-100">
              Learn how to address discriminatory comments and promote equal opportunities 
              regardless of age, sex, disability, race, ethnicity, origin, religion or economic status.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 md:px-16 lg:px-20 bg-[#071430] relative">
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-300/10 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0C1E4D] p-6 rounded-xl shadow-md hover:shadow-lg transition border border-blue-500/20 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">Practice with AI</h3>
              <p className="text-blue-100">
                Engage with our AI to practice responding to discriminatory comments in a safe environment.
              </p>
            </div>
            
            <div className="bg-[#0C1E4D] p-6 rounded-xl shadow-md hover:shadow-lg transition border border-blue-500/20 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">Connect Globally</h3>
              <p className="text-blue-100">
                Chat with people worldwide to share experiences and learn from diverse perspectives.
              </p>
            </div>
            
            <div className="bg-[#0C1E4D] p-6 rounded-xl shadow-md hover:shadow-lg transition border border-blue-500/20 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">Find Opportunities</h3>
              <p className="text-blue-100">
                Discover opportunities to promote equality and inclusion in your community and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-8 px-4 bg-[#051027] text-blue-100 border-t border-blue-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Equality Champions</h3>
            <p>Promoting SDGs 5 & 10 through technology and connection.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <div className="space-y-2 flex flex-col ">
              <Link href="/practice" className="hover:text-blue-300 hover:cursor-pointer">Practice</Link>
              <Link href="/chat" className="hover:text-blue-300 hover:cursor-pointer">Chat</Link>
            
            </div>
          </div>
          
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-blue-900/50 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Equality Champions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;