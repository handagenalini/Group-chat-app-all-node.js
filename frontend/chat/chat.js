const chatForm = document.getElementById('chat-form');
const chatMessageInput = document.getElementById('chat-message');
const userList = document.getElementById('user-list');
const chatMessages = document.getElementById('chat-messages');

const createGroupForm = document.querySelector('#create-group-form');
const groupNameInput = document.querySelector('#group-name');
const membersInput = document.querySelector('#members');
const groupsList = document.querySelector('#groups');

// const socket = io('http://localhost:8000')

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}





function showNewUserOnScreen(chat){
  const chatMessageElement = document.createElement('div');
  chatMessageElement.textContent = `${chat.name}: ${chat.text}`;
  chatMessages.appendChild(chatMessageElement);
}

window.addEventListener('load', ()=>{
  getusers();

  getGroups();

})

async function getGroups(){
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:3000/users/getgroupname",{headers: {'Authentication' :token}});
  const grpdetails = response.data.groupDetails;
  const parent = document.querySelector('#groups');
  for(let i=0;i<grpdetails.length;i++){
    let child = `<button class="btn btn-primary" onclick="insideGroup(${grpdetails[i].groupId})">${grpdetails[i].groupName} </button>`
    parent.innerHTML = parent.innerHTML + child
  }
}

async function insideGroup(id){
  try{
    localStorage.setItem("groupId", id)
    window.location.href = "../groupChat/groupChat.html"
  }catch{
    console.log('error in inside group froentend',err)
  }
}

async function getusers(){
    const response = await axios.get("http://localhost:3000/users/signup");
    console.log('------------------------------------------')
    
    const userlist = response.data.users;
    userlist.forEach((user) => {
      const userElement = document.createElement('div');
      userElement.textContent = user.name+" joined";
      userList.appendChild(userElement);
    });
}

async function getmessages(){
  let newKey = localStorage.key(0);
  console.log(newKey,'------------------------------------------')

  for(let i=1;i<localStorage.length;i++){
    if(localStorage.key(i)<newKey){
      newKey = localStorage.key(i);
    }
  }
 const response = await axios.get(`http://localhost:3000/users/chat?currenttime=${newKey}`);
 let chatHistory = response.data.message;
 console.log(response.data.message,'-----------------------------------------------------res')
 chatMessages.innerHTML = '';
  chatHistory.forEach((chat) => {
    const chatMessageElement = document.createElement('div');
    chatMessageElement.textContent = `${chat.userName}: ${chat.message}`;
    chatMessages.appendChild(chatMessageElement);
  });
}



createGroupForm.addEventListener('submit', async(event)=>{
  event.preventDefault();
  let grpinfromation = {
    groupName: groupNameInput.value,
    members: membersInput.value.split(',').map(email => email.trim())
  };
  if(groupNameInput.value && membersInput.value){
    try{
      const token = localStorage.getItem('token');
      const response =await axios.post("http://localhost:3000/group/creategrp",grpinfromation,  {headers: {'Authentication' : token}});
      console.log(response.data.groupid);
      if(response.status===201){
        //add new group to grouplist
        const parent = document.querySelector('#groups');
        let child = `<li onclick="insideGroup(${response.data.groupid});getGroups()">${groupNameInput.value}</li>`
        parent.innerHTML = parent.innerHTML+ child 

        groupNameInput.value = '';
        membersInput.value='';
      } 
        else if(response.status==202){
          groupNameInput.value = '';
          membersInput.value = '';
         alert('You are not admin of this group,you can not add the user to the group')
        }
        else {
          groupNameInput.value = '';
          membersInput.value = '';
          throw new Error(response.message);
        }
    } catch(error){
      alert(error.message)
    }
  }else{
    alert('Please fill out all fields.')
  }
})