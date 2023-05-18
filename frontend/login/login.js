async function login(event) {
    try{
        event.preventDefault();
        const obj = {
            email:event.target.email.value,
            password:event.target.password.value
        }

     const response= await axios.post('http://localhost:3000/users/login',obj)
        if(response.status=201){
             alert("User Succesfully logged in")
        }
        localStorage.setItem('token', response.data.token);
        window.location.href = '../chat/chat.html'
        }
    catch(err){
        document.body.innerHTML=`<div style="color:red;">${err}</div>`;
    }
}