/* import axios from "axios"

export const commonAPI = async (httpRequest,url,reqBody,reqHeader)=>{
    const reqConfig={
        method:httpRequest,
        url,
        data:reqBody,
        Headers:reqHeader?reqHeader:{"Content-type":"application/json"}
    }
    await axios(reqConfig).then((result)=>{
        return result
    }).catch((err)=>{
        return err
    })

} */
    import axios from "axios";

    export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
        const reqConfig = {
            method: httpRequest,
            url: url,
            data: reqBody,
            headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
        };
    
        try {
            const result = await axios(reqConfig);
            return result;
        } catch (err) {
            return err.response ? err.response : { status: 500, data: "An unexpected error occurred." };
        }
    };
    