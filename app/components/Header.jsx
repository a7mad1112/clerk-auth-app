import Link from 'next/link';
import { auth, UserButton } from '@clerk/nextjs';
const Header = () => {
  const { userId } = auth();
  return (
    <>
      <navber className="bg-[#475569] p-6 flex items-center justify-between mb-5">
        <div className="flex items-center">
          <Link href="/" >
            <div className="text-lg uppercase font-bold text-white">
              Clerk App
            </div>
          </Link>
        </div>
        {
      !userId ? <>
          <div className="text-white flex items-center">
            <Link href="/sign-in" className='text-gray-300 hover:text-white mr-4' >
              Sign In
            </Link>
            <Link href="/sign-up" className='text-gray-300 hover:text-white mr-4' >
              Sign Up
            </Link>
            <Link href="/register" className='text-gray-300 hover:text-white mr-4' >
              Register
            </Link>
          </div>
          </>
          : <div className="ml-auto">
              <UserButton afterSignOutUrl="/" />
            </div>
        }
        {
          userId && <Link href="/profile" className='text-gray-300 hover:text-white ml-4 mr-4' >
            Profile
          </Link>
        }
      </navber>
    </>
  )
}

export default Header
