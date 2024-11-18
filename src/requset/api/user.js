import axios from '@/requset/http';
import requset from 'axios';
import test from '@/requset/http';

/**
 * @typedef {Object} UpdateUserParams
 * @property {number} [id]
 * @property {string} [name]
 * @property {string} [sex]
 * @property {number} [age]
 * @property {string} [pic]
 * @property {string} [acc]
 * @property {string} [pwd]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {string} [dept]
 * @property {string} [post]
 * @property {string} [status]
 * @property {string} [createBy]
 * @property {string | unknown} [createTime]
 * @property {string} [updateBy]
 * @property {string | unknown} [updateTime]
 * @property {string} [remark]
 */

/**
 * @typedef {Object} UpdateUserRes
 * @property {string} message
 * @property {boolean} success
 * @property {number} code
 * @property {Object.<string, unknown>} data
 */

/**
 * 修改-账号
 * @param {UpdateUserParams} params 修改账号的参数
 * @returns {Promise<UpdateUserRes>}
 */

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
    }

}

export default userApi
