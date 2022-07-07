const TOKEN = 'eb29b5bab6cb4477be5001478ddc185d'; // API key for BlockCypher
const awesome = "awesome awesome awesome awesome awesome awesome awesome awesome awesome awesome awesome awesome";
const path = "84'/0'/1024'/0";
var index = "12"; // spending entire amount from here
var privKeyHex;
var segwitAddress;
const testAddress = "bc1qpc8fa090n4gnujq0asnql97azehy4y4ytqqr0q"; // sending to this address to D's wallet for testing
var sendTo; // address to send the funds to
var sequenceNumber = 0xfffffffd; // supports RBF
var blockstreamVB = 0;
var rbf; // horrible variable name, this is the fee for the first tx only
var vB;
var donation;
var txid = 0; // this is the txid of the previous output (funding output)
var fromamount = 0;
var outputnum = 2000;
var currentBlockHeight = 1000000;
var txArray = [];
var blockTimer;
var winnerFound = false; // check for final winner by looking at what txid actually got mined...s
const extraFee = 20; // add extra sats to be safe, needs 3 more for legacy 1 addresses, 12 more for p2wsh
// actual winners!!
var actualWinningAmount;
var actualWinningTeam;
var actualWinningCharity;
var actualWinningTxid;
var winningBlockHeight;

// 294 is minumum tx size to be within dust theshold p2wpkh
// segwit scripts is 327?? p2wsh

async function doMain() {
	privKeyHex = getPrivkeyHex(awesome, path, index);
	segwitAddress = getNativeSegwitAddressFromPrivkeyHex(privKeyHex);

	var hexTransaction = await takeMoney(privKeyHex, testAddress, 0);
	var rate = await getFeeEstimate(); // fast fee est from mempool.space - get into the next block!
	console.log("Transaction without fee: " + hexTransaction);

	var tx = bitcoinjs.Transaction.fromHex(hexTransaction);
	vB = tx.virtualSize();

	rbf =  vB * rate + extraFee; // make sure we'll get into the next block!
	console.log('fee is: ' + rbf);
	// rbf = vB; // FOR TESTING: set to 1 sat/vByte for testing

	console.log("the initial fee amount is " + rbf);
	console.log("the fast fee estimate is: " + rate);
	console.log("The tx size in vB: " + vB);
	getAPIUsage();
}

async function letsRBF(sendTo) {
	if (sendTo == null)
		sendTo = testAddress;

	getAPIUsage();
	console.log("Sending tx with fee: " + rbf);
	var hexTransaction = await takeMoney(privKeyHex, sendTo, rbf);
	rbf += vB + extraFee; // to be safe, add extra sats in the event of legacy tx
	console.log("Transaction with fee:" + hexTransaction);
	if (!testMode)
		sendTx(hexTransaction);
	else {
		// todo: do this
		// find a random txid in the mempool and send it to the localstorage?!
	}
}

async function getFeeEstimate() {
		// mempool.space is used to get fee estimates
    await $.getJSON("https://mempool.space/api/v1/fees/recommended", function(data) {
       console.log("High priority fee: " + data.fastestFee + " sat/vB");
			 // console.log("Medium priority fee: " + data.halfHourFee + " sat/vB");
			 // console.log("Low priority fee: " + data.hourFee + " sat/vB");
			 console.log("Minimum fee: " + data.minimumFee + " sat/vB");
			 feeRate = data.fastestFee;
    });
		return feeRate;
}
/*
async function getVBytes(txid) {
	// GET /tx/:txid
	// Returns information about the transaction.
	// Available fields: txid, version, locktime, size, weight, fee, vin, vout and status
	$.getJSON("https://blockstream.info/api/tx/" + txid, function(data) {
		 console.log("blockstream responded with the following data:");
		 console.log(data);
		 resolve(Math.ceil(data.weight/4));
	});
}
//getVBytes("319c529d9532ff10b6568d7333d1e02456cd49c16ef570f00af67f2de1b41254");
*/

// sends to Blockstream
function sendTx(rawtx) {
	console.log('inside sendTx');
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
								if (this.readyState == 4 && ( this.status == 200 || this.status == 201 ) ) {
										console.log("txid: " + this.responseText);
										// // get size of tx in vbytes
										// if (blockstreamVB == 0) {
										// 	async function coolWay(thetxid) {
										// 		// await blocks in a relative scope - blocks the function that it's in currently but not other functions
										// 		blockstreamVB = await getVBytes(thetxid);
										// 		console.log('happens second');
										// 	}
										// 	coolWay(this.responseText);
										// 	console.log('happens first');
										// }

										// add txid, charity name, and team name to front of the history array
										// .giveUpYourSpot
										// .letSomeoneCut
										// .prepend
										// .putItInTheBegining
										txArray.unshift({txid: this.responseText, team: winningTeam, charity: winningCharity, amount: donation.toLocaleString("en-US")});
										console.log("array of transactions:");
										console.log(txArray);

										// update RBF with the number of bytes
										// store the new txid in localstorage
										localStorage.setItem("txid", this.responseText);
										// figure out what the size is of this txid by asking blockstream and store that size into a variable. weight / 4 is vbytes
								}
								if (this.readyState == 4 && this.status == 400) {
									console.log('got 400. LETS GO INSIDE IT!');
									var str = this.responseText;
									str = JSON.parse(str.substr(str.indexOf('{'))).message;
									console.log("Blockstream responded with an error: " + str);
								}
				};
				xhttp.open("POST", "https://blockstream.info/api/tx", true);
				xhttp.setRequestHeader( "Content-type", "text/plain" );
				xhttp.send(rawtx);
}

function getPrivkeyHex(backupwords, path, index) {
        var seed = bip39.mnemonicToSeedSync(backupwords);
        var node = bip32.fromSeed(seed);
        var path = "m/" + path + "/" + index;
        var root = node;
        var child = root.derivePath( path );
        return computeRawPrivkey( child );
}

function computeRawPrivkey( node ) {
        return bitcoinjs.ECPair.fromPrivateKey( node.privateKey, { network: bitcoinjs.networks.mainnet } ).__D.toString( "hex" );
}

//Define an async function, which is a normal function but with the word "async" before its name. Async functions have this property:
// if a line in them has the keyword "await" which expects data from a function containing a promise, the next line won't run til the
// promise resolves.

async function takeMoney(fromprivkey, to, fee) {
					var fromaddress = getNativeSegwitAddressFromPrivkeyHex( fromprivkey );
					var senderPrivkeyWif = getWifFromPrivkeyHex( fromprivkey );
					if (!txid)
						txid = await getIdOfTxThatSentMeMoney( fromaddress );
					if (outputnum == 2000) // only get it once by initially setting it to a crazy high number
						outputnum = await getOutputNumberOfTxThatSentMeMoney( fromaddress, txid );
					var frompubkey = getCompressedPubkeyHexFromPrivkeyHex( fromprivkey );
					if (!fromamount)
						fromamount = await getAmountOfTxThatSentMeMoney( fromaddress, txid );
					var result = sendCoins( senderPrivkeyWif, txid, outputnum, frompubkey, fromamount, to, fee );
					return result;
}

function getNativeSegwitAddressFromPrivkeyHex( privkeyhex ) {
        return bitcoinjs.payments.p2wpkh({ pubkey: bitcoinjs.ECPair.fromPrivateKey( buffer.Buffer.from( privkeyhex, "hex" ), { network: bitcoinjs.networks.mainnet } ).publicKey, network: bitcoinjs.networks.mainnet }).address;
}

function getWifFromPrivkeyHex( privkeyhex ) {
        return bitcoinjs.ECPair.fromPrivateKey( buffer.Buffer.from( privkeyhex, "hex" ), { network: bitcoinjs.networks.mainnet } ).toWIF();
}

// Define functions which we will use later to create a psbt, namely, functions for getting a WIF-formatted privkey and an address from a hex-formatted privkey (as well as a hex-formatted pubkey)
function getCompressedPubkeyHexFromPrivkeyHex( privkeyhex ) {
				return bitcoinjs.ECPair.fromPrivateKey( buffer.Buffer.from( privkeyhex, "hex" ), { network: bitcoinjs.networks.mainnet } ).publicKey.toString( "hex" );
}

function pushBTCpmt( rawtx ) {
 			// sends tx to blockcypher, but doesn't work with RFB copies... or at least i don't think it does, we can try it again
			 var xhttp = new XMLHttpRequest();
			 xhttp.onreadystatechange = function() {
							 if ( this.readyState == 4 && ( this.status == 200 || this.status == 201 ) ) {
											 alert( this.responseText );
							 }
			 };
			 console.log('calling blockcypher api');
			 xhttp.setRequestHeader( "Content-type", "text/plain" );
			 xhttp.open( "POST", "https://api.blockcypher.com/v1/btc/main/txs/push", true );
			 xhttp.send( '{"tx":"' + rawtx + '"}' );
}

// spends all coins from address
function sendMultipleCoins(senderPrivkeyWif, inputtxid, inputindex, frompubkey, fromamount, to, fee) {

}

function sendCoins(senderPrivkeyWif, inputtxid, inputindex, frompubkey, fromamount, to, fee) {
			 var toamount = fromamount - fee;
			 var psbt = new bitcoinjs.Psbt({ network: bitcoinjs.networks.mainnet })
							 .addInput({
								 			 // enables rbf by setting sequence to less than maximum value
											 sequence: sequenceNumber,
											 hash: inputtxid,
											 index: inputindex, // means OUTPUT index (vout)
											 witnessUtxo: {
															 script: buffer.Buffer.from( '0014' + bitcoinjs.crypto.ripemd160( bitcoinjs.crypto.sha256( buffer.Buffer.from( frompubkey, "hex" ) ) ).toString( 'hex' ), 'hex' ),
															 value: fromamount,
											 },
							 })
							 /*
							 // anchor address for red team (currently: bitcoin spoon wallet)
							 .addOutput({
											 address: "bc1q33cvy8682w9fqazcje39hauxmd3gr79efgmmu0",
											 value: 500,
							 })
							 // anchor address for blue team (currently: bitcoin spoon wallet)
							 .addOutput({
											 address: "bc1qflvkd9q7a26drdjtj4wd3hcpz5l5kswxaph9jl",
											 value: 500,
							 })
							 */
							 // output address for winning charity
							 .addOutput({
											 address: to,
											 value: toamount,
											 //value: toamount - 1000, // need to subtract anchor outputs
							 });
							 // donation = fromamount - fee - 1000; // need to subtract anchor outputs
							 donation = fromamount - fee;

							 var keyPairSender = bitcoinjs.ECPair.fromWIF( senderPrivkeyWif, bitcoinjs.networks.mainnet );
							 psbt.signInput( 0, keyPairSender );
							 psbt.validateSignaturesOfInput( 0 );
							 psbt.finalizeAllInputs();
							 console.log(psbt);
							 return psbt.extractTransaction().toHex();
							 // this sends it:
							 // pushBTCpmt( psbt.extractTransaction().toHex() );
}

function getIdOfTxThatSentMeMoney( stealthaddress ) {
		 return new Promise( function( resolve, reject ) {
					 var xhttp = new XMLHttpRequest();
					 xhttp.onreadystatechange = function() {
								 if ( this.readyState == 4 && this.status == 200 ) {
										 var json = JSON.parse( xhttp.responseText );
										 /*
										 if ( json[ "unconfirmed_txrefs" ] && json[ "unconfirmed_txrefs" ].length > 0 ) {
											 length = json[ "unconfirmed_txrefs" ].length;
											 var txid = json[ "unconfirmed_txrefs" ][ length - 1 ][ "tx_hash" ];
											 // alert( "You have at least one unconfirmed transaction, please try again later" );
											 // reject( "You have at least one unconfirmed transaction, please try again later" );
										 } else {
											 length = json[ "txrefs" ].length;
		 									 var txid = json[ "txrefs" ][ length - 1 ][ "tx_hash" ];
							 			}
										sessionStorage[ "txid" ] = txid;
										resolve( txid );
										*/
										// check tx_output_n and make sure that it is greater than -1
										// also check that spent is false
										// json.txrefs // <-- loop through the array and find the id of the tx that has not been spent

										var txrefs = json.txrefs;
										console.log(json);
										if (json[ "unconfirmed_txrefs" ] && json.unconfirmed_txrefs.length > 0)
											txrefs = json.unconfirmed_txrefs;

										for (var i = 0; i < txrefs.length; i++) {
											if(txrefs[i].tx_output_n < 0)
												continue; // continue the loop, but don't execute the loop body from here (next if statement)

											if (txrefs[i].hasOwnProperty('spent') && txrefs[i].spent == false) {
													// yeah!
													// console.log('we found one!!!!!!!!!!');
													var txid = txrefs[i].tx_hash;
													// console.log("the txid we want is: " + txid);
													sessionStorage[ "txid" ] = txid;
													resolve(txid);
											 }
										}
										// not sure if this needs to be here???? because this executes even if we resolve txid i think....
										resolve(null);
								 }
					 };
					 // console.log('calling blockcypher api for getIdOfTxThatSentMeMoney');
					 xhttp.open( "GET", "https://api.blockcypher.com/v1/btc/main/addrs/" + stealthaddress + '?token=' + TOKEN, true );
					 xhttp.send();
		 });
}

function getOutputNumberOfTxThatSentMeMoney( stealthaddress, txid ) {
		 return new Promise( function( resolve, reject ) {
					 var xhttp = new XMLHttpRequest();
					 xhttp.onreadystatechange = function() {
								 if ( this.readyState == 4 && this.status == 200 ) {
											 var json = JSON.parse( xhttp.responseText );
											 var i; for ( i=0; i<json[ "outputs" ].length; i++ ) {
														 var j; for ( j=0; j<json[ "outputs" ][ i ][ "addresses" ].length; j++ ) {
																	 if ( stealthaddress == json[ "outputs" ][ i ][ "addresses" ][ j ] ) {
																				 resolve( i );
																	 }
														 }
											 }
								 }
					 };
					 // console.log('calling blockcypher api for getOutputNumberOfTxThatSentMeMoney');
					 xhttp.open( "GET", "https://api.blockcypher.com/v1/btc/main/txs/" + txid + '?token=' + TOKEN, true );
					 xhttp.send();
		 });
}

function getAmountOfTxThatSentMeMoney( stealthaddress, txid ) {
		 return new Promise( function( resolve, reject ) {
					 var xhttp = new XMLHttpRequest();
					 xhttp.onreadystatechange = function() {
								 if ( this.readyState == 4 && this.status == 200 ) {
											 var json = JSON.parse( xhttp.responseText );
											 var i; for ( i=0; i<json[ "outputs" ].length; i++ ) {
														 var j; for ( j=0; j<json[ "outputs" ][ i ][ "addresses" ].length; j++ ) {
																	 if ( stealthaddress == json[ "outputs" ][ i ][ "addresses" ][ j ] ) {
																				 resolve( json[ "outputs" ][ i ][ "value" ] );
																	 }
														 }
											 }
								 }
					 };
					 // console.log('calling blockcypher api for getAmountOfTxThatSentMeMoney');
					 xhttp.open( "GET", "https://api.blockcypher.com/v1/btc/main/txs/" + txid + '?token=' + TOKEN, true );
					 xhttp.send();
		 });
}

// Define functions for getting data from various sources that take time to deliver it. We'll call them later too.
function getAPIUsage() {
		 var xhttp = new XMLHttpRequest();
		 xhttp.onreadystatechange = function() {
					 if ( this.readyState == 4 && this.status == 200 ) {
							 var json = JSON.parse( xhttp.responseText );
							 if (json.hasOwnProperty('hits'))
							 	console.log("Remaining API calls for this hour: " + (200-json.hits['api/hour']));
							else console.log("You've gone over your limit... or you just started, lol");
					 }
		 };
		 // https://api.blockcypher.com/v1/tokens/eb29b5bab6cb4477be5001478ddc185d
		 xhttp.open( "GET", "https://api.blockcypher.com/v1/tokens/" + TOKEN, true );
		 xhttp.send();
}

async function checkWinner(possibleWinner) {
	await $.getJSON("https://mempool.space/api/tx/" + possibleWinner.txid + '/status', function(data) {
		 console.log("checking status of " + possibleWinner.txid);
		 console.log(data);
		 if (data.confirmed) { // this checks if the txid is confirmed on the blockchain
			 winnerFound = true;
			 console.log("this one is a winner!");

			 // actualWinningAmount = // figure out how many sats the winner actually got.....

			 actualWinningTeam = possibleWinner.team;
			 actualWinningCharity = possibleWinner.charity;
			 actualWinningAmount = possibleWinner.amount;
			 actualWinningTxid = possibleWinner.txid;

			 if (actualWinningTeam == winningTeam) {
				 console.log("the team we expected to win won!");
				 if (possibleWinner.txid == localStorage.getItem("txid")) // check to see if the most recent tx made it...
				 	console.log("the txid we expected to win won!!")
				else {
					console.log("the winning tx and recent tx are not the same dog!!")
				}
			 }
			 else {
				 localStorage.setItem("winning", actualWinningTeam); // send the actual winning team name
				 localStorage.setItem("txid", possibleWinner.txid);  // send the actual winning txid
				 console.log("We expected " + winningTeam + " to win, but " + actualWinningTeam + " did instead!!")
			 }

			 winningTeam = actualWinningTeam;
			 winningCharity = actualWinningCharity;
			 donation = actualWinningAmount;

			 showFinalWinner(winningBlockHeight);
			 gameStart = false;
			 gameStop = true;
		 }
		 else {
			 // so if a block was found but we weren't in it, we need to not hang up the page
		   console.log("this one ain't it. your princess is in another castle");
		 }
	});
}
// test cases
/*
checkWinner({ txid: '6c62a73547cc6853a08083744de5bfe3ce8f9696ad03c6d330d94840e38de0ad'}); // this one is confirmed
checkWinner({ txid: 'b716f327776e7dc051b138eadc14020e6333d83e843f9425a68ff5e4d6153f89'}); // this one was submitted but not confirmed (RBFed)
checkWinner({ txid: 'b716f327776e7dc051b138eadc14020e6333d83e843f9425a68ff5e4d6153f87'}); // this is an invalid txid... ok so i doesn't matter if it's valid or not, confirmed will just be "false"
*/

async function getBlockHeight() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
						if (JSON.parse(xhttp.responseText) > currentBlockHeight) { // we found a block!!
							winningBlockHeight = JSON.parse(xhttp.responseText);
							// do block celebration!!
							// display winner and stop game
							// but don't stop game if a team hasn't scored a goal yet
							console.log("we found a block!!!!!!!!!!!!");
							if (haveWinner && !testMode) { // if we have at least one tx in the mempool...
								// stop looking for new blocks...
								clearTimeout(blockTimer);
								// okay.......... before we display the final winner, we need to check to see which txid was actually included in the most recent block!!!
								// we're going to do this by iterating through txArray until we find the REAL winner
								do {
									for (var i = 0; i < txArray.length; i++) {
										// most recent transactions will be in the front of the array
										await checkWinner(txArray[i]);
										if (winnerFound) {
											// if success, stop looping
											break;
										}
									}
								} while(!winnerFound);
							}
						}
            currentBlockHeight = JSON.parse(xhttp.responseText);
            // console.log("Block height: " + currentBlockHeight);
        }
        if (this.status == 400) {
          console.log('got 400');
        }
    };
    xhttp.open("GET", "https://blockstream.info/api/blocks/tip/height");
    xhttp.send();
}

function updateBlockHeight() {
  getBlockHeight();
  // update the block height every other second
  blockTimer = setTimeout(updateBlockHeight, 1000 * 2);
}

updateBlockHeight();
