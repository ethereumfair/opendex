import baseApi from '../api/baseApi.js'
import store from '../store'

let socket
let uuid
const XUMMWalletConnetcHandle = async ($scope) => {
  if (socket && uuid && socket.readyState === WebSocket.OPEN) {
    baseApi.getXUMMWalletInfo(uuid)
    .then((res) => {
      if(res.resCode === '800'){
        $scope.wallet = 'XUMM'
        store.commit('setChainId', '1008600')
        store.commit('setWalletAddress', res.data.info.response.account)
        store.commit('setWalletName', 'XUMM')
        store.commit('setWalletConnectType', 'XUMM')
        localStorage.setItem('connectorId', 'XUMM')
        if($scope.$refs.dialog) $scope.$refs.dialog.show = false
      }
    })

    return
  }
  baseApi.payload({
    t: new Date()
  }).then(res => {
    if (res.resCode === '800') {
      const info = JSON.parse(res.data.info)
      
      if (info.refs.qr_png && info.refs.websocket_status) {
        store.commit('setQRcode', info.refs.qr_png)
        // Create WebSocket connection.
        socket = new WebSocket(info.refs.websocket_status);

        // Connection opened
        socket.addEventListener('open', function (event) {
          //socket.send('Hello Server!', event);
          //console.log('open data ', event);
        });

        // Connection close
        socket.addEventListener('close', function (event) {
          //console.log('close data ', event);
        });

        // Connection error
        socket.addEventListener('error', function (event) {
          //console.log('error data ', event);
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
          //console.log('Message from server ', event.data);
          const data = JSON.parse(event.data)
          if (data.signed) {
            uuid = data.payload_uuidv4
            baseApi.getXUMMWalletInfo(uuid)
            .then((res) => {
              if(res.resCode === '800'){
                $scope.wallet = 'XUMM'
                store.commit('setChainId', '1008600')
                store.commit('setWalletAddress', res.data.info.response.account)
                store.commit('setWalletName', 'XUMM')
                store.commit('setWalletConnectType', 'XUMM')
                localStorage.setItem('connectorId', 'XUMM')
                $scope.$refs.qrcode.dismiss()
              }
              
            })
            

            //getXRPWalletBalance(store.state.wallet.address)
          }
        })
        if($scope.$refs.dialog) $scope.$refs.dialog.show = false
        $scope.$refs.qrcode.show()
      }
    }
  })
}

const XUMMConnectClose = () => {
  if (socket) {
    socket.close()
  }
}

async function getXRPWalletBalance(addr) {
  let xrp = await baseApi.getXRPBalance(addr)

  let tokens = await baseApi.getXRPTokensBalance(addr)

  let balance = new Array()
  balance[0] = { value: xrp.xrpBalance }
  balance = [...balance, ...tokens]

  return balance
}
export default { XUMMWalletConnetcHandle, XUMMConnectClose}