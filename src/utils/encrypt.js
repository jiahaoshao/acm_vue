import api from "@/requset/api";
import { ElMessage } from "element-plus";
import JSEncrypt from "encryptlong";

const $message = ElMessage
const $api = api
let publicKey = ''
let privateKey = ''

/**
 * 最长加密长度
 */
const MAX_ENCRYPT_BLOCK = 64
/**
 * 最长解码长度
 */
const MAX_DECRYPT_BLOCK = 128

/**
 * @description RSA加密(支持长字符加密)
 */
const encryptedPwd = (pwd) => {
    // getKey();
    //创建实例
    const encrypt = new JSEncrypt()
    // 设置公钥
    encrypt.setPublicKey(publicKey)
    return encrypt.encryptLong(pwd)
}

/**
 * @description RSA解密(支持长字符解密)
 * @param pwd
 * @returns 
 */
const decryptedPwd = (pwd) => {
    const decrypt = new JSEncrypt();
    //设置私钥
    decrypt.setPrivateKey(privateKey)
    return decrypt.decryptLong(pwd)
}

const getKey = () => {
    try {
        $api.signApi.getKey()
            .then((response) => {
                // console.log(response);
                if (response.data.code === 0) {
                    publicKey = response.data.data.publicKey;
                    privateKey = response.data.data.privateKey;
                }
            })
    } catch (error) {
        console.error(error);
        $message.error('获取密钥失败');
    }
}


export {
    encryptedPwd,
    decryptedPwd,
    getKey
}
