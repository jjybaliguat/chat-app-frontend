"use client"
import React from 'react'

const CustomButton = ({
    title,
    containerStyles,
    textStyles,
    isDisabled,
    rightIcon,
    btnType,
    handleClick
}) => {
  return (
    <button
        disabled={isDisabled || false}
        type={btnType || "button"}
        className={`custom-btn ${containerStyles} ${isDisabled ? 'opacity-[0.6] cursor-not-allowed' : ''}`}
        onClick={handleClick}
    >
      <span className={`flex-1 ${textStyles}`}>
            {title}
        </span>
        {rightIcon && (
          <div className="relative w-6 h-6">
            <Image src={rightIcon}
              alt="right icon"
              fill
              className='object-contain'
            />
          </div>
        )}
    </button>
  )
}

export default CustomButton
