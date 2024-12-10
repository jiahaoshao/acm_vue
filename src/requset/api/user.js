import axios from '@/requset/http';

const userApi = {
    updateavatar(params){
        return axios({
            url: "user/updateavatar",
            method: "post",
            data: params,
            headers:{
                'Content-Type': 'multipart/form-data',
            }
        })
      },
    getavatar(params){
        return axios.get('download/avatar', {params : params}, {resposeType: "blob"});
    },
    updateuser(params){
        return axios.get('user/update', {params : params});
    },
    getavatarbase64(params){
        return axios.get('github/download_base64', {params : params});
    },
    getuserbyuid(params){
        return axios.get('user/finduserbyuid', {params : params});
    }
}

export default userApi
