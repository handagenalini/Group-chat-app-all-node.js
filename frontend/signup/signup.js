async function signup(e){
    try{
        e.preventDefault();
        const signupDetails = {
            name :e.target.name.value,
            email :e.target.email.value,
            phonenumber :e.target.phonenumber.value,
            password :e.target.password.value
        }
        console.log(signupDetails)
        const response = await axios.post('http://localhost:3000/users/signup', signupDetails);
        console.log('hii',response.data);
        if(response.status=== 201){
            alert('User created successfully');
            window.location.href = "../Login/login.html"
         } else if(response.status==401){
            alert("User already exists, Please Login");
             console.log(response.data.message);
            }
        else{
            throw new Error('Failed to login')
        }

    }catch(err){
       document.body.innerHTML += `<div style="color:red">${err}</div> ` 
    }
}