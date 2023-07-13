"use client"
import { Tab } from '@headlessui/react'
import { Avatar, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation'
import { useUpdateuserMutation } from '@/redux/authApiSlice'
import { setUser, updateUser } from '@/redux/userAction'
import { useFormik } from 'formik'
import * as Yup from 'yup';


const page = () => {
    const [api, contextHolder] = notification.useNotification();
    const user = useSelector(store=>store.auth.user)
    const [updateuser] = useUpdateuserMutation()
    const dispatch = useDispatch()
    const [userData, setUserData] = useState(null)
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [index, setIndex] = useState(0)
    const router = useRouter()

    useEffect(()=>{
        setUserData({...user})
    }, [])

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try {
            const res = await updateuser({
                newUsername: userData?.username,
                newEmail: userData?.email
            })
            dispatch(updateUser(res.data))
            setUserData({...res.data.user})
        } catch (error) {
            console.log(error);
        }
    }

    const formik = useFormik({
        initialValues: {
            currentPass: "",
          newPass: "",
          cPass: ""
        },
        validationSchema: Yup.object({
            currentPass: Yup
          .string()
          .max(255)
          .required('Please enter current password'),
          newPass: Yup
          .string()
          .max(255)
          .required('Password is required'),
          cPass: Yup
            .string()
            .required('Please retype your password.')
            .oneOf([Yup.ref('newPass')], 'Passwords must match')
        }),
        onSubmit: async() => {
            try {
                const res = await updateuser({
                    currentPass: formik.values.currentPass,
                    password: formik.values.newPass
                })
                
                if(!res.error){
                    api['success']({
                        message: "Password updated successfully",
                        placement: 'topLeft'
                    });
                    formik.resetForm()
                }else{
                    console.log(res);
                    api['error']({
                        message: res.error?.data?.message,
                        placement: 'topLeft'
                    });
                }

            } catch (error) {
                console.log(error);
                api['error']({
                    message: error.data?.message,
                    placement: 'topLeft'
                });
            }
        }
      })

  return (
    <>
        {contextHolder}
        <div className='h-fit min-h-[100vh] w-[100vw] flex'>

            <button
            className='absolute top-5 left-5 bg-secondary-100 rounded-[10px] p-3 flex flex-row items-center gap-3'
            onClick={()=>router.back()}
            >
                <ArrowLeftIcon class="h-6 w-6 text-gray-500" /> Back
            </button>

            <div className='flex-center md:flex-row h-fit pt-20 pb-10 items-center gap-10 flex-col w-full'>
                <div
                className='flex flex-col gap-10 justify-center p-5 md:h-[400px] md:w-[400px] w-[90%]  h-fit bg-white shadow-lg rounded-[20px]'
                >
                    <div className='flex flex-col items-center gap-3'>
                        <Avatar size={150} icon={<img src="/avatardefault.png"/>} />
                        <h1 className='text-[1.5rem]'>{user.username}</h1>
                    </div>
                    {/* <div className='flex flex-col gap-2'>
                        <h1 className='font-extrabold'>Email: </h1>
                        <p>{user.email}</p>
                    </div> */}
                </div>
                <div
                className='flex flex-col gap-10 p-5 min-h-[450px] h-fit md:w-[600px] w-[90%] bg-white shadow-lg rounded-[20px]'
                >
                    <Tab.Group>
                        <Tab.List className='flex flex-row gap-5'>
                            <Tab
                            className={`md:text-[1.5rem] text-[1rem] font-bold p-3 rounded-[10px]
                            ${index === 0 ? "bg-secondary-100" : ""}
                            outline-none`}
                            onClick={()=>setIndex(0)}
                            >Profile</Tab>
                            <Tab
                            className={`md:text-[1.5rem] text-[1rem] font-bold p-3 rounded-[10px]
                            ${index === 1 ? "bg-secondary-100" : ""}
                            outline-none`}
                            onClick={()=>setIndex(1)}
                            >Change Password</Tab>
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel>
                                <form
                                onSubmit={handleSubmit}
                                className='flex flex-col gap-5'
                                autoComplete='off'
                                >
                                    <div className='flex flex-col gap-2'>
                                        <label for="username">Username</label>
                                        <input
                                            type='text'
                                            name="username"
                                            placeholder='Enter username'
                                            className='w-full p-5 outline-none shadow-md rounded-[10px]'
                                            value={userData?.username}
                                            onChange={(e)=>setUserData({...userData, username: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label for="email">Email</label>
                                        <input
                                            type='text'
                                            name="email"
                                            placeholder='Enter current password'
                                            className='w-full p-5 outline-none shadow-md rounded-[10px]'
                                            value={userData?.email}
                                            onChange={(e)=>setUserData({...userData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button
                                    type="submit"
                                    disabled={userData?.email === "" || userData?.username === ""}
                                    className={`
                                    ${(userData?.email === "" || userData?.username === "") ? "bg-secondary-100" : "bg-primary text-white "}
                                    rounded-[10px] p-5 cursor-pointer`}
                                    >
                                        Submit
                                    </button>
                                </form>
                            </Tab.Panel>
                            <Tab.Panel>
                            <form
                                onSubmit={formik.handleSubmit}
                                className='flex flex-col gap-5'
                                >
                                    <div className='flex flex-col gap-2'>
                                        <input
                                            type='text'
                                            name="currentPass"
                                            placeholder='Enter current password'
                                            className='w-full p-5 outline-none shadow-md rounded-[10px]'
                                            value={formik.values.currentPass}
                                            onChange={formik.handleChange}
                                            required
                                        />
                                        <label className='text-[red]' for="currentPass">{formik.errors.currentPass}</label>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <input
                                            type='password'
                                            name="newPass"
                                            placeholder='Enter new password'
                                            className='w-full p-5 outline-none shadow-md rounded-[10px]'
                                            value={formik.values.newPass}
                                            onChange={formik.handleChange}
                                            required
                                        />
                                        <label className='text-[red]' for="newPass">{formik.errors.newPass}</label>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <input
                                            type='password'
                                            name="cPass"
                                            placeholder='Retype your password'
                                            className='w-full p-5 outline-none shadow-md rounded-[10px]'
                                            value={formik.values.cPass}
                                            onChange={formik.handleChange}
                                            required
                                        />
                                        <label className='text-[red]' for="cPass">{formik.errors.cPass}</label>
                                    </div>
                                    <button
                                    type="submit"
                                    disabled={!formik.isValid}
                                    className={`
                                    ${(!formik.isValid) ? "bg-secondary-100" : "bg-primary text-white "}
                                    rounded-[10px] p-5 cursor-pointer`}
                                    >
                                        Submit
                                    </button>
                                </form>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>

        </div>
    </>
  )
}

export default page
