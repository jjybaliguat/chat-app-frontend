"use client"

import React, { useState } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik'
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import CustomButton from './CustomButton';
import { EyeIcon } from "@heroicons/react/24/outline";
import { useLoginMutation } from '@/redux/authApiSlice';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userAction';
import { useRouter } from 'next/navigation';



const Login = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [login] = useLoginMutation()
  const dispatch = useDispatch()
  const [errorMess, setErrorMess] = useState(null)
  const router = useRouter()

  const toggleShowPass = () => setShowPassword(!showPassword)

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup
      .string()
      .max(255)
      .required('Username is required'),
      password: Yup
      .string()
      .max(255)
      .required('Password is required')
    }),
    onSubmit: async() => {
      setErrorMess(null)
        try {
          const user = await login(formik.values).unwrap()
          console.log(user);
          dispatch(setUser({...user}))
          router.push("/chats")
        } catch (error) {
          setErrorMess(error.data.message)
        }
    }
  })
  
  return (
    <>
      <div
      className='bg-white h-full w-full p-5'
      >
        <form onSubmit={formik.handleSubmit}>
          <div
            className='flex flex-col gap-3'
          >
            <div className='gap-1'>
              <input
                autocomplete="off"
                className={`w-full p-3 rounded-[10px] outline-1 outline ${formik.errors.username? "outline-[red]" : "outline-gray-300"} focus:outline-2 focus:outline-primary`}
                type='text'
                name="username"
                helperText={formik.errors.username}
                placeholder='Enter your Username'
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              {
                formik.errors.username && (
                  <label className='text-[red]' for="username">{formik.errors.username}</label>
                )
              }
            </div>
            <div className='relative'>
              <input
                autocomplete="off"
                className={`w-full p-3 rounded-[10px] outline-1 outline ${formik.errors.password? "outline-[red]" : "outline-gray-300"} focus:outline-2 focus:outline-primary`}
                type={showPassword? 'text' : 'password'}
                name="password"
                helperText={formik.errors.password}
                placeholder='Enter your Password'
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <label className='text-[red]' for="password">{formik.errors.password}</label>
              {showPassword? (
                <EyeIcon
              className="absolute right-2 top-3 h-6 w-6 text-black cursor-pointer" 
              onClick={toggleShowPass}
              />
              ) : (
                <EyeSlashIcon  
                className="absolute right-2 top-3 h-6 w-6 text-gray-500 cursor-pointer" 
                onClick={toggleShowPass}
                />
              )
              }
            </div>
              <button
                  type="submit"
                  disabled={!formik.isValid}
                  className={`
                  ${(!formik.isValid) ? "bg-secondary-100" : "bg-primary text-white "}
                  rounded-[10px] p-3 cursor-pointer`}
                >
                    Submit
                </button>
            {
              errorMess && (
                <h1 className='text-[1.5rem] text-center text-[red] font-bold'>{errorMess}</h1>
              )
            }
            </div>
        </form>
      </div>
    </>
  )
}

export default Login
