'use client'

import { useRouter } from 'next/navigation';



export default function Home() {
  const router = useRouter();
  return (
    <div className=" min-h-screen w-full p-0 m-0">
    <div className="h-[100dvh] w-[75dvw] bg-bg-image bg-cover bg-no-repeat bg-center p-0 m-0 rounded-r-xl relative brightness-75  ">
      </div>
    <div className="flex flex-col justify-center items-center absolute inset-0">
      <h1 className="font-extrabold text-5xl w-auto">Chat with your Friends</h1>
      <div className="flex justify-center items-center m-4 text-xl">
        <div className="flex flex-col justify-center items-center mr-4">
          Do you have an account?
        <button className="bg-color1 h-[40px] w-[150px] rounded-lg transition-colors duration-300 hover:bg-color2" 
        onClick={() => router.push('/signIn')}>
          Sign In
        </button>
        </div>
        <div className="flex justify-center flex-col items-center ">
          Create an account
          <button className="bg-gray-800 h-[40px] w-[150px] rounded-lg transition-colors duration-300 hover:bg-gray-600"
          onClick={() => router.push('/signUp')}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
