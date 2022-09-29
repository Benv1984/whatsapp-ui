import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { SearchContainer, SearchInput } from './ContactListCopmponent.js'
import { messagesList } from '../MockData'
import Picker from 'emoji-picker-react'
import httpManager from "../managers/httpManager"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  height: 100%;
  width: 100%;
  background: #f6f7f8;
`
const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
  align-items: center;
  gap: 10px;
`
const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  gap: 10px;
`

const ChatBox = styled.div`
  display: flex;
  flex-direction: row;
  background: #f0f0f0;
  padding: 10px;
  align-items: center;
  bottom: 0;
`
const EmojiImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  opacity: 0.4;
  cursor: pointer;
`
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: #e5ddd6;
`
const MessageDiv = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isYours ? "flex-end" : "flex-start")};
  margin: 5px 15px;
`

const Message = styled.div`
  background: ${(props) => (props.isYours ? "#daf8cb" : "white")};
  padding: 8px 10px;
  border-radius: 4px;
  max-width: 50%;
  color: #303030;
  font-size: 14px;
`
const ConverstationComponent = (props) => {
  const {selectedChat, userInfo, refreshContactList} = props
  const [text, setText] = useState('')
  const [pickerVisible, togglePicker] =useState(false)
  const  [messageList, setMessageList] = useState([])
  const otherUser =
  selectedChat.channelData.channelUsers.find(
    (userObj) => userObj.email !== userInfo.email
  )
  const onEmojiClick = (event, emojiObj) => {
      setText(text+emojiObj.emoji)
      togglePicker(false)
  }
  useEffect(() => {
    setMessageList(selectedChat.channelData.messages)
  }, [selectedChat]);

  const onEnterPress = async (event) => {
    const channelId = selectedChat.channelData._id;
    if (event.key === "Enter") {
      // if (!messageList || !messageList.length) {
      //   const channelUsers = [
      //     {
      //       email: userInfo.email,
      //       name: userInfo.name,
      //       profilePic: userInfo.imageUrl,
      //     },
      //     {
      //       email: otherUser.email,
      //       name: otherUser.name,
      //       profilePic: otherUser.profilePic,
      //     },
      //   ];
      //   // const channelResponse = await httpManager.createChannel({
      //   //   channelUsers,
      //   // });
      // }
      
      const messages = [...messageList]
      
      const msgReqData = {
        text,
        senderEmail: userInfo.email,
        addedOn: new Date().getTime(),
      };
      messages.push(msgReqData)
      setMessageList(messages)
      setText("")
      
      await httpManager.sendMessage({
        channelId,
        message: msgReqData,
      });
     
     
      refreshContactList()
    }
  };
  return <Container>
    <ProfileHeader>
    <ProfileImage src={otherUser.profilePic} />
    {otherUser.name} 
    </ProfileHeader>
    <MessageContainer>
      {messageList.map((messageData) =>(
        <MessageDiv isYours={messageData.senderEmail === userInfo.email}>
        <Message isYours={messageData.senderEmail === userInfo.email}>{messageData.text}</Message>
    </MessageDiv>
      ))}   
    </MessageContainer>
    <ChatBox>
        <SearchContainer>
          {pickerVisible&&(
          <Picker
          pickerStyle={{position:'absolute', bottom:'60px'}}
          onEmojiClick={onEmojiClick} 
          />)}
          <EmojiImage src='https://www.clipartmax.com/png/small/97-976308_black-smiley-face-emoticon-smiling-emoji-black-and-white.png' onClick={()=>togglePicker(!pickerVisible)}/>
          <SearchInput placeholder='Type a message' 
          value={text} 
          onKeyDown={onEnterPress}
          onChange={(e)=>setText(e.target.value)}
          />
        </SearchContainer>
    </ChatBox>
    </Container>
}

export default ConverstationComponent