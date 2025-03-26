const TerraExchangeHandle = async function(fromAddress,platformAddr,fromNumber) {
      const {MsgSend, LCDClient, Coin, Extension} = await import('@terra-money/terra.js')
      const platAddress = platformAddr.split('#')
      const msgs =  [new MsgSend(fromAddress, platAddress[0], [
        new Coin('uluna', fromNumber*1000000),
      ])]
      const tx = {
        msgs,
        memo:platAddress[1]
      }
      const ext = new Extension()
      const res = await ext.request('post', JSON.parse(JSON.stringify(tx)))
      return res.payload
}
export default TerraExchangeHandle