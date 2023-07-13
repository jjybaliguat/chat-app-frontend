import React from 'react'

const Avatar = ({
    size,
    img,
    style
}) => {
  return (
    <div className={`${size === "xs" ? 'h-[1.5rem] w-[1.5rem]' : size === "small" ? 'h-[2.5rem] w-[2.5rem]' : size === "medium" ? 'h-[3rem] w-[3rem]' : 'h-[8rem] w-[8rem]'} rounded-full ${style}`} >
      <img src={img ? img : '/avatardefault.png'} className={`rounded-full h-full w-full outline outline-1 outline-gray-100`} />
    </div>
  )
}

export default Avatar
