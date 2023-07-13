"use client"

import Spinner from "@/components/Spinner"
import { setChats } from "@/redux/chatAction"
import { useGetallchatsMutation } from "@/redux/chatApislice"
import { getAllChats } from "@/utils"
import { generateChatsData } from "@/utils/generateChatData"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const page = () => {
  const [getallchats] = useGetallchatsMutation()
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector(store=>store.auth?.user)
  const chats = useSelector(store=>store.chat.chats)
  const [loading, setLoading] = useState(false)
  
  useEffect(()=>{
    getAllChats()
  }, [])

  const getAllChats = async() => {
    setLoading(true)
    try {
      const res = await getallchats()
      dispatch(setChats(res.data))
      if(res.data.length > 0){
        router.push(`/chats/${res.data[0]._id}`)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  if(loading){
    return <Spinner />
  }

  return (
    !loading  && (
    <>
    <div className="w-[100vw] h-[100vh] text-black flex flex-col gap-0 items-center">
      <img src="/nodata.png" alt="No Data" className="w-[300px] h-[400px]" />
      <h1 className="text-[2rem] font-bold">No Message Here</h1>
    </div>
    </>
    )
  )
}

export default page
