import baseApi from '../api/baseApi'


const failureExchange = async (params) =>{
    baseApi.failureExchange(
        params
    ).then( result => {
        console.log(result)
    })
}
export default failureExchange