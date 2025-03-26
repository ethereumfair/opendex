const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const splTokenV049 = require('@solana/spl-token-v0.4.9');
import store from '../store'
let solanaMain
// sol代币发送
const solTokenSend = async function (platformAddr, tokenAddress, fromNumber) {
	solanaMain = store.state.wallet.connectType == 'Phantom' ? window.solana : window.safepal
	const connection = new solanaWeb3.Connection(
		store.state.rpcObject.SOL[0] || 'https://rpc.ankr.com/solana', // mainnet-beta  devnet
		'confirmed',
	);
	// 连接账户
	const account = await solanaMain
	// token转账
	const res = await transferToken(account, platformAddr, tokenAddress, connection, fromNumber);
	return res
}
async function getTokenProgramId(publicKey, tokenAddress, connection) {
	var tokenAccount = await getTokenAccounts(publicKey, tokenAddress, connection)
	var programId = tokenAccount.value.length > 0 ? tokenAccount.value[0].account.owner : '';
	return programId;
}
async function getTokenAccounts(publicKey, tokenAddress, connection) {
	var tokenPublic = new solanaWeb3.PublicKey(tokenAddress);
	var tokenAccount = await connection.getParsedTokenAccountsByOwner(publicKey, { 'mint': tokenPublic });
	return tokenAccount;
}

async function transferToken(fromWallet, toWallet, tokenAddress, connection, fromNumber) {
	var programId = tokenAddress == 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC' ? new solanaWeb3.PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') : await getTokenProgramId(fromWallet.publicKey, tokenAddress, connection);
	var tokenPublic = new solanaWeb3.PublicKey(tokenAddress);
	const token = await new splToken.Token(connection, tokenPublic, programId, fromWallet);
	let fromTokenAccount
	if (tokenAddress == 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC') {
		const associatedAddress = await splToken.Token.getAssociatedTokenAddress(token.associatedProgramId, token.programId, token.publicKey, new solanaWeb3.PublicKey(fromWallet.publicKey), true);
		fromTokenAccount = await splTokenV049.getAccount(connection, associatedAddress, 'finalized', programId);
	} else {
		fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
			fromWallet.publicKey,
		);
	}
	console.log(programId)

	console.log(token)
	const destPublicKey = new solanaWeb3.PublicKey(toWallet)
	// Get the derived address of the destination wallet which will hold the custom token
	const associatedDestinationTokenAddr = await splToken.Token.getAssociatedTokenAddress(
		token.associatedProgramId,
		token.programId,
		tokenPublic,
		destPublicKey
	);
	const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
	const instructions = [];
	if (receiverAccount === null) {
		instructions.push(
			splToken.Token.createAssociatedTokenAccountInstruction(
				token.associatedProgramId,
				token.programId,
				tokenPublic,
				associatedDestinationTokenAddr,
				destPublicKey,
				fromWallet.publicKey,
			)
		)
	}
	instructions.push(
		splToken.Token.createTransferInstruction(
			programId,
			fromTokenAccount.address,
			associatedDestinationTokenAddr,
			fromWallet.publicKey,
			[],
			BigInt(fromNumber),
		)
	)
	const transaction = new solanaWeb3.Transaction().add(
		...instructions
	);
	transaction.feePayer = fromWallet.publicKey
	const anyTransaction = transaction
	anyTransaction.recentBlockhash = (
		await connection.getLatestBlockhash('max')
	).blockhash
	try {
		if (localStorage.getItem('utm_source') !== 'tokenpocket') {
			await solanaMain.connect()
		}
		// console.log(transaction)
		// let signed = await solanaMain.signTransaction(transaction)
		// let signature = await connection.sendRawTransaction(
		// 	signed.serialize(),
		// ) || await solanaMain.signAndSendTransaction(transaction)
		let { signature } = await solanaMain.signAndSendTransaction(transaction)
		connection.confirmTransaction(signature, "confirmed");
		return signature
	} catch (err) {
		return false
	}
}
export default solTokenSend