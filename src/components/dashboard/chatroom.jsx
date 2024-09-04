import React, {useState} from 'react';
import './chatroom.css'

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sentMessage, setSentMessage] = useState(false);


  const sendMessage = async () => {
    if (input.trim() !== ''){
      setMessages([...messages, {text: input, user: 'User'}]);
      setSentMessage(true);
      setInput('');
      console.log('trying to send message');
      const loadingMessage = {text: "...", user: 'Bot'}
      setMessages(prevMessages => [...prevMessages, loadingMessage]);
      try { //try contacting server for GPT response
        const response = await fetch('http://localhost:5500/api/send-message',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message: input}), 
        });

        if (!response.ok){
          throw new Error('response not ok')
        }

        const data = await response.json();
        console.log(data.reply);
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg === loadingMessage ? {...msg, text: data.reply} : msg
          )
        );
      } catch (e){
        console.log('Error:', e)
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg === loadingMessage ? {...msg, text: "" + e} : msg
          )
        );
      }
      
    } 
  }

  return (
    <div className = "chatroom-container">
      <div className = "messages">
        {sentMessage === false ? "Ask FitMe anything about fitness to get started!" : messages.map((msg, index) => (
          <Message key = {index} text = {msg.text} user = {msg.user}/>
        ))}
      </div>
      <div className = "input-area">
        <input
          type = "text"
          value = {input}
          onChange = {(e) => setInput(e.target.value)}
          placeholder = "Message FitMe"
        />
        <button onClick = {sendMessage}>Send</button>
      </div>
    </div>
  )
}

const Message = ({ text, user }) => {
  return (
    <div className={`message ${user === 'User' ? 'user' : 'bot'}`}>
      <p>{text}</p>
    </div>
  );
};

export default Chatroom; 
