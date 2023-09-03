const chatForm = document.getElementById('chat-form');
const chatMessageInput = document.getElementById('chat-message');
const userList = document.getElementById('user-list');
const chatMessages = document.getElementById('chat-messages');

const removeMemberForm = document.querySelector('#remove-member-form');
const membersInput = document.querySelector('#members');

const makeMemberAdmin = document.querySelector('#admin-member-form');
const makeMemberAdminInput = document.querySelector('#memberstomakeadmin');
// import io from 'socket.io-client';



const socket = io('http://localhost:8000')


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

chatForm.addEventListener('submit',async (event) => {
event.preventDefault();
const token=localStorage.getItem('token');
 const groupId=JSON.parse(localStorage.getItem('groupId'));

const tok=parseJwt(token);

const grpid=localStorage.getItem('groupId')
let message ={text:chatMessageInput.value};
let obj={
  name:tok.name,
  text:chatMessageInput.value,
  id:grpid
}

const date = new Date().getTime(); // Get current timestamp
localStorage.setItem(date, JSON.stringify(obj)); // Store chat message with timestamp as key

// Remove oldest chat message if there are more than 10 saved
let oldestKey=localStorage.key(0);
if (localStorage.length > 11) {
  for(let i=1;i<localStorage.length;i++){
    if(localStorage.key(i)<oldestKey){
    oldestKey=localStorage.key(i);
    }

  } // Get key of oldest chat message
  localStorage.removeItem(oldestKey); // Remove oldest chat message from localStorage
}
const response = await axios.post(`http://localhost:3000/users/chat?groupid=${grpid}`,message,{headers: {'Authentication' :token}});
socket.emit('send-message', groupId);

chatMessageInput.value = '';
});


// function showNewExpenseOnScreen(chat){
// if(chat.id){
// const chatMessageElement = document.createElement('div');
// chatMessageElement.textContent = `${chat.name}: ${chat.text}`;
// chatMessages.appendChild(chatMessageElement);}
// }



window.addEventListener('load', ()=>{
getusers();
// let Details, details;
//   Object.keys(localStorage).forEach((key) => {
//     if(key!=='token' && key!=='groupId'){
//   Details = localStorage.getItem(key);
//   details = JSON.parse(Details);
//   showNewExpenseOnScreen(details);}
//   });
  getmessages()
})

async function getusers(){
const grpid=localStorage.getItem('groupId');
const response = await axios.get(`http://localhost:3000/groupusers/getname?groupid=${grpid}`);
console.log(response)
const userlist=response.data.grpusers;
const grpName=response.data.grpusers[0].groupName;
const groupNameElement = document.getElementById('memberstomakeadmin');
groupNameElement.textContent = grpName;
userList.innerHTML='';
userlist.forEach((user) => {
const userElement = document.createElement('div');
userElement.className='h5'
userElement.textContent = user.name+" joined";
userList.appendChild(userElement);
});
}

async function getmessages(){
// let newKey=localStorage.key(0);
// for(let i=1;i<localStorage.length;i++){
//     if(localStorage.key(i)<newKey){
//    newKey=localStorage.key(i);
//   }

// }

const grpid=localStorage.getItem('groupId')
// console.log("currenttime",newKey);

const response = await axios.get(`http://localhost:3000/users/chat?groupid=${grpid}`);
const chatHistory=response.data.message;
// Clear previous messages
chatMessages.innerHTML = '';
chatHistory.forEach((chat) => {
const chatMessageElement = document.createElement('div');
chatMessageElement.className="h5"
chatMessageElement.textContent = `${chat.userName}: ${chat.message}`;
chatMessages.appendChild(chatMessageElement);
});
}

// let intervalId;

// function startUpdatingMessages() {
// // Clear any previous interval
// clearInterval(intervalId);

// // Set new interval to call the function every 1 second
// intervalId = setInterval(getmessages, 1000);
// }

// startUpdatingMessages();
socket.on('receive-message', async (group) => {
  const groupId=JSON.parse(localStorage.getItem('groupId'));
  console.log(">>>>>",group,groupId);
  console.log(group===groupId);
  if(group === groupId){
      getmessages();
      getusers();
  }
})
removeMemberForm.addEventListener('submit', async(event) => {
  event.preventDefault();
  const grpid=localStorage.getItem('groupId');
  let memberremoveinformation = {
    grpId:grpid,
    members: membersInput.value.split(',').map(name => name.trim())
  };

  if (membersInput.value) {
    try {
       const token= localStorage.getItem('token');

       const response = await axios.post("http://localhost:3000/group/removemember",memberremoveinformation ,{headers: {'Authentication' :token}});
         console.log(response) ;
      if (response.status==201) {
        getusers();
        membersInput.value = '';
        alert(`${response.data.message}`)

      }
      else if(response.status==202){
        membersInput.value = '';
        alert(`${response.data.message}`) }

      else if(response.status==200){
        getusers();
        membersInput.value = '';
      alert(`${response.data.message}`)

      }
       else {
        membersInput.value = '';
        throw new Error(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert('Please fill out all fields.');
  }
});



makeMemberAdmin.addEventListener('submit', async(event) => {
  event.preventDefault();
  const grpid=localStorage.getItem('groupId');
  let membermakeadmininformation = {
    grpId:grpid,
    members: makeMemberAdminInput.value.split(',').map(name => name.trim())
  };

  if (makeMemberAdminInput.value) {
    try {
       const token= localStorage.getItem('token');

       const response = await axios.post("http://localhost:3000/group/makememberadmin",membermakeadmininformation ,{headers: {'Authentication' :token}});
         console.log(response) ;
      if (response.status==201) {
        getusers();
        makeMemberAdminInput.value = '';
        alert(`${response.data.message}`)

      }
      else if(response.status==202){
        makeMemberAdminInput.value = '';
        alert(`${response.data.message}`) }

        else if(response.status==204){
          makeMemberAdminInput.value = '';
          alert(`${response.data.message}`) }

      else if(response.status==200){
        getusers();
        makeMemberAdminInput.value = '';
      alert(`${response.data.message}`)

      }
       else {
        makeMemberAdminInput.value = '';
        throw new Error(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert('Please fill out all fields');
  }
});