import axios from 'axios';
import store from '../store'

const tronApi = 'https://api.trongrid.io'
//100000 Requests / Day
const tronApiKey = [] // 需要自己申请api-key

// 增加axios拦截
axios.interceptors.response.use((suc) => {
    return Promise.resolve(suc);
}, (error) => {
    return Promise.reject(error);
});

class GeneralApi {
    // constructor
    /**
     * @param {string} url 请求地址
     * @param {Object} data 请求参数
     * @param {string} method  http请求方式
     * @param {string} responseType 相应类型
     */
    createRpcRequest(url, data, headers, method) {
        method = method || 'post';
        if (method.toLowerCase() === 'get') {
            let params = '';
            Object.keys(data).forEach(
                function (key) {
                    if (data[key]) {
                        let value = data[key];
                        params += key + '=' + value + '&';
                    }
                }
            );
            if (params.length > 0) {
                params = params.substr(0, params.length - 1);
                url += '?' + params;
                data = {};
            }
        }
        data = JSON.stringify(data);
        return axios({
            url: url,
            method: method,
            data: data,
            dataType: "json",
            timeout: 20000,
            headers: headers
        });
    }
    
    //trx&trc10  
    getTRC10TokenAccount(data) {
        let dex = store.state.trcKeyDex;
        let apiKey = tronApiKey[dex];
        store.commit('setTrcKeyDex', (dex + 1) % 4);
        if(!apiKey){
            apiKey = tronApiKey[0]
        }
        const headers = {
            "Content-Type": "application/json;",
            "TRON-PRO-API-KEY": apiKey
        }
        return this.createRpcRequest(tronApi + '/wallet/getaccount', data, headers);
    }

    //所有
    getTRCTokenAccount(data){
        let dex = store.state.trcKeyDex;
        let apiKey = tronApiKey[dex];
        store.commit('setTrcKeyDex', (dex + 1) % 4);
        if(!apiKey){
            apiKey = tronApiKey[0]
        }
        const headers = {
            "Content-Type": "application/json;",
            "TRON-PRO-API-KEY": apiKey
        }
        return this.createRpcRequest(tronApi + '/v1/accounts/' + data, '', headers, "get");
    }

    //trc20
    getTRC20TokenBalance(contactAddress, ownerAddress){
        let dex = store.state.trcKeyDex;
        let apiKey = tronApiKey[dex];
        store.commit('setTrcKeyDex', (dex + 1) % 4);
        if(!apiKey){
            apiKey = tronApiKey[0]
        }
        const headers = {
            "Content-Type": "application/json;",
            "TRON-PRO-API-KEY": apiKey
        }

        const data = {
            "contract_address": contactAddress,
            "function_selector":"balanceOf(address)",
            "parameter": ownerAddress.padStart(64, '0'),
            "owner_address": ownerAddress
        }
        return this.createRpcRequest(tronApi + '/wallet/triggerconstantcontract', data, headers);
    }
    
}
const generalApi = new GeneralApi();
export default generalApi;