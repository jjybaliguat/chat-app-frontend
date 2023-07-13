import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import Avatar from './Avatar'
import { useLogoutMutation } from '@/redux/authApiSlice'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Link from 'next/link'

const ProfileMenuDropDown = () => {
    const [logout] = useLogoutMutation()
    const router = useRouter()
    const user = useSelector(store=>store.auth.user)

    const handleLogout = async() => {
        try {
            const response = await logout()
            console.log(response);
            router.push("/")
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
    <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center px-4 py-2">
            <Avatar
                size="small"
                // img={}
                // style="outline outline-1 outline-primary"
             />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
            <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                    } group flex flex-col w-full rounded-md px-2 py-2 text-sm`}
                  >
                    <h1 className='font-bold'>{user?.name}</h1>
                    <p className='text-[12px]'>{user?.username}</p>
                  </button>
                )}
              </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                  <Link href="/user/profile">
                    <button
                      className={`${
                        active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Profile Settings
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
            <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default ProfileMenuDropDown
