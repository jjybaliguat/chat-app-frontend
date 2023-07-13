"use client"

import React, { useState } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik'
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import CustomButton from './CustomButton';
import { EyeIcon } from "@heroicons/react/24/outline";
import { useRegisterMutation } from '@/redux/authApiSlice';
import { notification } from 'antd';

const SignUp = () => {
  const [api, contextHolder] = notification.useNotification();
  const [showPassword, setShowPassword] = useState(false)
  const [register] = useRegisterMutation()

  const toggleShowPass = () => setShowPassword(!showPassword)

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      cpass: "",
    },
    validationSchema: Yup.object({
      name: Yup
      .string()
      .max(255)
      .required('Name is required'),
      email: Yup
      .string().email("Invalid email format")
      .max(255)
      .required('Email is required'),
      username: Yup
      .string()
      .max(255)
      .required('Username is required'),
      password: Yup
      .string()
      .max(255)
      .required('Password is required'),
      cpass: Yup
      .string()
      .required('Please retype your password.')
      .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: async() => {
      try {
        const res = await register({
          name: formik.values.name,
          email: formik.values.email,
          username: formik.values.username,
          password: formik.values.password,
        })
        if(res.data){
          api['success']({
            message: "Account created successfully, Please login",
              placement: 'topLeft'
          });
          formik.resetForm()
        }else{
          api['error']({
              message: res.error?.data?.message,
              placement: 'topLeft'
          });
        }
      } catch (error) {
        console.log(error);
        api['error']({
          message: `Error: ${error.message}`,
            placement: 'topLeft'
        });
      }
    }
  })

  return (
    <>
    {contextHolder}
      <div
      className='bg-white h-full w-full p-5'
      >
        <form onSubmit={formik.handleSubmit}>
          <div
            className='flex flex-col gap-5'
          >
            <div className='gap-1'>
              <input
                autocomplete="off"
                className={`w-full p-3 rounded-[10px] outline-1 outline ${formik.errors.name? "outline-[red]" : "outline-gray-300"} focus:outline-2 focus:outline-primary`}
                type='text'
                name="name"
                helperText={formik.errors.name}
                placeholder='Enter your Fullname'
                value={formik.values.name}
                onChange={formik.handleChange}
              />
                {
                  formik.errors.name && (
                    <label for="name" className='text-[red]'>{formik.errors.name}</label>
                  )
                }
            </div>
            <div className='gap-1'>
              <input
                autocomplete="off"
                className={`w-full p-3 rounded-[10px] outline-1 outline ${formik.errors.email? "outline-[red]" : "outline-gray-300"} focus:outline-2 focus:outline-primary`}
                type='text'
                name="email"
                helperText={formik.errors.email}
                placeholder='Enter your email'
                value={formik.values.email}
                onChange={formik.handleChange}
              />
                {
                  formik.errors.email && (
                    <label for="email" className='text-[red]'>{formik.errors.email}</label>
                  )
                }
            </div>
            <div className='gap-1'>
              <input
                autocomplete="off"
                className={`w-full p-3 rounded-[10px] outline-1 outline ${formik.errors.username? "outline-[red]" : "outline-gray-300"} focus:outline-2 focus:outline-primary`}
                type='text'
                name="username"
                helperText={formik.errors.username}
                placeholder='Create your Username'
                value={formik.values.username}
                onChange={formik.handleChange}
              />
                {
                  formik.errors.username && (
                    <label for="username" className='text-[red]'>{formik.errors.username}</label>
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
              {
                  formik.errors.password && (
                    <label for="password" className='text-[red]'>{formik.errors.password}</label>
                  )
                }
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
            <div className='gap-1'>
              <input
                  autocomplete="off"
                  className={`w-full p-3 rounded-[10px] outline-1 outline ${formik.errors.cpass? "outline-[red]" : "outline-gray-300"} focus:outline-2 focus:outline-primary`}
                  type='password'
                  name="cpass"
                  helperText={formik.errors.cpass}
                  placeholder='Enter your Password'
                  value={formik.values.cpass}
                  onChange={formik.handleChange}
                />
                {
                  formik.errors.cpass && (
                    <label for="cpass" className='text-[red]'>{formik.errors.cpass}</label>
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
            </div>
        </form>
      </div>
    </>
  )
}

export default SignUp
