import axios from '@/requset/http';

const userApi = {
    uploadavatar(params){
        return axios({
            url: "upload/avatar",
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
    }
}

export default userApi
