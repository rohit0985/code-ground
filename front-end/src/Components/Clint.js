import React from 'react'
import Avatar from "react-avatar"

const Clint = ({userName}) => {
  return (
    <div className='clint'>
    <Avatar name={userName} size={50} round={'14px'} />
      <span className='userName'>{userName}</span>
    </div>
  )
}

export default Clint
