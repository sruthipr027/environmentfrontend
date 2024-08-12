import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from '../services/allAPI';



function Register() {
    const [userData, setUserData]= useState({
        username:'',
        email:'',
        password:''
    })
    const navigate= useNavigate()
   /*  console.log(userData); */
   const handleRegister=async(e)=>{
    e.preventDefault()
    const {username,email,password}=userData
    if(!username || !email || !password){
        alert('Please fill the form completely')
    }else{
       const result= await registerAPI(userData)
       console.log(result);
       if(result.status === 200){
        alert('registration successful')
        setUserData({
            username:"",
            email:'',
            password:''
        })
        navigate('/login')
       }
       else{
        alert(`${result.data}`)
       }
    }
   }
  return (
    <div className=''>
     

      {/*  */}
      <div>
      <section className='px-3 registermain '>
        <div className='w-50 mx-auto rounded  border border-solid  align-items-center justify-content-center shadow-lg p-3 mb-3 bg-white rounded register mt-3'>
          <h3 className='text-center mb-3'>Hello !<span className='text-light'>Welcome  </span></h3>
          <form className='' onSubmit={handleRegister}>
          <div className=' d-flex align-items-center justify-content-center '>
              <input type="name" 
               placeholder=' Enter Your Username'
                name='name'
                value={userData.username}
                onChange={(e)=> setUserData({...userData,username:e.target.value})}
                className='w-75  rounded  border border-solid align-items-center justify-content-center shadow-lg p-3 mb-2  bg-white rounded'
                />

            </div>
            <div className=' d-flex align-items-center justify-content-center '>
              <input type="email" 
               placeholder=' Enter Your Email'
                name='email'
                value={userData.email}
                onChange={(e)=> setUserData({...userData,email:e.target.value})}

                className='w-75  rounded  border border-solid align-items-center justify-content-center shadow-lg p-3 mb-2   rounded'
                />

            </div>
            <div className=' d-flex  align-items-center justify-content-center '>
              <input type="password" 
               placeholder=' Enter Your Password'
                name='password'
                value={userData.password}
                onChange={(e)=> setUserData({...userData,password:e.target.value})}

                className='w-75  rounded  border border-solid align-items-center justify-content-center shadow-lg p-3 mb-3 bg-white rounded'
                />

            </div>

            <div className=' d-flex  align-items-center justify-content-center'>
              <button  className='btn btn-success w-75 ' type='submit'>Register</button>

            </div>

            <div>
              <p className=' name mt-2 d-flex align-items-center justify-content-center'>Already have an account?<Link style={{textDecoration:'none'}} to={'/login'}> Login</Link></p>

            </div>

          </form>
        </div>

      </section>
    </div>
    </div>
  )
}

export default Register