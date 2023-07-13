export const generateChatsData = (data) => {
    let newChats = []
    data.map((chat)=>{
      if(chat.isGroupChat){
          newChats.push(chat)
      }else{
          if(chat.users[0]._id === user?._id){
              chat.chatName = chat.users[1].name
          }else{
              chat.chatName = chat.users[0].name
          }
          newChats.push(chat)
      }
  })
  
  return newChats
  }