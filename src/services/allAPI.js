import { BASE_URL } from "./baseurl"
import { commonAPI } from "./commonAPI"

//register 
export const registerAPI = async(users)=>{
   return await commonAPI('POST',`${BASE_URL}/user/register`,users,"")

}
export const loginAPI = async(users)=>{
    return await commonAPI('POST',`${BASE_URL}/user/login`,users,"")
 
 }
