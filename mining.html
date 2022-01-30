<!DOCTYPE html>
<html lang="en">
<head>
<title>D++</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<!--link rel="shortcut icon" type="image/jpg" href="taproot.ico"/-->
<base target="_blank"/>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js"></script>
<link rel="stylesheet" href="files/style.css">
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&family=Roboto:wght@300;400;500&display=swap');
</style>
<style>
body {
  color:white;
  font-family: 'Manrope', sans-serif;
  background:linear-gradient(68.78deg,#ff6ab4 -5.3%,#ffd569 124.36%);
}
.code {
	font-family: monospace;
}
@media (max-width:630px) {
 #main-div {
    max-width:320px;
 }
 h1 {
   font-size:30px;
 }
 h3 {
   font-size:18px;
 }
}
input {
  -webkit-border-radius:0;
   border-radius:0;
}
</style>
</head>
<body>
<header style="background-image: url('images/Mining.jpg')">
<!--img src=images/Title.png style="width:500px; max-width:95%"-->
</header>
<br>
<div class="container" style="max-width:625px; width:100%;">

<div class="office-banner" style="display:none">
<h1>
    &nbsp; You found the nonce! <img style="cursor:pointer" src=https://i.imgur.com/kFfPU9D.png width=20 id="close" onclick="$('.office-banner').hide(); $('canvas').hide()">
</h1>
<div style="font-size:30px; margin-top:-15px">Lucky Number <span id="winner"></span></div>
</div>
<h3><i>Guess the Nonce to Mine a Block!</i></h3>
<center>
<div style="background-color:black; border:1px solid black;" id="main-div">
	<div style="color:white; background-color:black; margin-left: -1px; margin-right: -1px; margin-top: -1px; padding:15px; text-align:left;">
		<b><u>BLOCK HEADER</u></b><br><br>
		← previous block hash:<br>
		<span class="code">00000000001b0142eab9e5da7188ef8762c49113b3c988086d54089f826787f9</span><br><br>
		difficulty target:<br>
		<span id="target" class="code">0FF00000000404CB000000000000000000000000000000000000000000000000</span><br><br>
    <center>
    timestamp: <span id="epoch" class="code"></span><br><br>
		<!-- nonce can be 32 bits, largest unsigned integer is 4,294,967,295, around 4 billion values
    technically, once these are quickly exhausted, the coinbase tx can be changed thus changing the merkle root in the block header
	  -->
		<input type="number" max=4294967295 min=0 id="nonce-input"
		oninput="if (this.value < 0) this.value = 0; if (this.value > 4294967295) this.value = 4294967295" placeholder="nonce"
    style="height:30px; line-height:30px"></input>

		<button onclick="tryNonce()" style="font-weight:bold!important; font-size:14px!important; margin-left:1px; font-size:12px; font-weight:400; text-transform: uppercase; height:30px; line-height:30px; border:0px solid red; padding-top:1px; padding-bottom:12px; color:black; background:#5ddd9d">
			HASH
		</button>

	</div>

  <div id="results-block" style="display:none; padding-top: 20px; padding-bottom: 20px">
  <div class="jagged-border-top"></div>
  <div style="text-align: left; color:black; background-color:white; padding:15px; padding-top:35px; padding-bottom:30px"><b><u>RESULT</u></b><br><br>
    block header hash: <span id="hash" class="code"></span><br>
  	<center>is <span id="result-area"></span> the target of</center>
  	<span id="target-compare" class="code"></span>
    <center><b><div id="message" style="color:red; letter-spacing:1.5px; font-size:18px; padding-top:10px"></div></b></center>
  </div>
  <div class="jagged-border-top-inverse"></div>
  </div> <!-- closed results-block -->

	<div style="background-color:black; color:white;">
		<div style="background-color:black; color:white; padding:15px; padding-top:25px; padding-bottom:5px; padding-right:5px; border:1px solid black;"></div>
    <b><u>TRANSACTIONS</u></b><br><br>
		Transaction #1<br>
		Transaction #2<br>
		Transaction #3<br>
		...<br>
		Transaction #n<br><br><br>
	</div>
</div>
<br><br><br><br>
</div> <!-- end container -->
<script src="files/footer.js"></script>

<script>
function compareBig(hash, target) {
	// expects two 32 byte buffers
	// console.log("the hash is " + hash);
	// console.log("the target is " + target);
	// if the hash is greater than the target, return false, meaning if the hash equals the target we have found a block
	for (var i = 0; i < 32; i++) {
		if (hash[i] > target[i])
			return false;
		if (hash[i] < target[i])
			return true;
	}
	return true;
}

function hex2buf(string) {
	// console.log(string);
	var result = new Uint8Array(32);
	var hexCounter = 0;
	for (var i = 0; i < 32; i++) {
		var hex = string.substring(hexCounter, hexCounter + 2);
		result[i] = parseInt(Number("0x" + hex), 10);
		hexCounter += 2;
	}
	// console.log("buffer is " + result);
	return result;
}

function testCompare() {
	var hash = new Uint8Array(32);
	var target = new Uint8Array(32);
	hash =   hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82942edabb7deb82a1");
	target = hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82942edabb7deb82a1");
	console.log(compareBig(hash, target));

	hash =   hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82942edabb7deb82a1");
	target = hex2buf("01bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82942edabb7deb82a1");
	console.log(compareBig(hash, target));

	//////////////////////////////////////////////////////////////////.
	hash =   hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82842edabb7deb82a1");
	target = hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82942edabb7deb82a1");
	console.log(compareBig(hash, target));

	//////////////////////////////////////////////////////////////////.
	hash =   hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82942edabb7deb82a1");
	target = hex2buf("d1bc8d3ba4afc7e109612cb73acbdddac052c93025aa1f82842edabb7deb82a1");
	console.log(compareBig(hash, target));
}
// testCompare();

function binString2buf(string) {
	var result = new Uint8Array(32);
	for (var i = 0; i < 32; i++) {
		// taking 8 bytes and putting it into 8 bits
		// console.log("loop #" + i);
		result[i] = 0;
		for (var c = 0; c < 8; c++) {
			if (Number(string[i*8 + c]) === 1) {
				result[i] |= 1 << (7 - c);
			}
		}
	}
	return result;
}

function numToArrayBuffer(string) {
	// candidate block == block in progress being constructed / mined
	// technically the bitcoin block header is 80 bytes
	// it contains 6 different data fields in little endian format
	// bitcoin mostly uses little endian.  networking usually uses big endian
	// big endian = most significant bytes are first (human readable)
	// little endian = lest significant bytes are first (not human readable, it's reversed)
	// we actually want to use double sha

	// extraNonce parameters usually go in the script signature (unlocking script)
	// of the coinbase transaction. it is not formally defined, however many mining
	// pools use an extraNonce of 8 bytes, however this can vary from pool to pool.

	// block weight must be under 4 MB

	// ONE S19 can exhaust the entire 32 bit nonce search space in under 1 millisecond!!!
	/***********************************************************************************/

	// take a string, convert it to binary, then convert it to a 4 byte array buffer

	string = Number(string).toString(2);
	// make sure it's 32 bits
	string = "00000000000000000000000000000000".substr(string.length) + string;
	// console.log("string is " + string);

	var result = new Uint8Array(4);
	for (var i = 0; i < 4; i++) {
		// taking 8 bytes and putting it into 8 bits
		// console.log("loop #" + i);
		result[i] = 0;
		for (var c = 0; c < 8; c++) {
			if (Number(string[i*8 + c]) === 1) {
				result[i] |= 1 << (7 - c);
			}
		}
	    // console.log("result[" + i + "] is: " + result[i]);
	}
	return result;
}

function buf2bin(buffer) {
	var view = new Uint8Array(buffer);
	var result = "";
	for (var i = 0; i < view.length; i++) {
		var binary = view[i].toString(2);
		binary = "00000000".substr(binary.length) + binary;
		result += binary;
	}
	return result;
}

function buf2hex(buffer) {
	// buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

async function shaMe(inputString) {
	// console.log("inputstring is " + inputString);
  // let's not convert, this was for the other workshop
	// need to convert this to binary

	// var inputBytes = binString2buf(inputString);
	// console.log("inputBytes is " + inputBytes);

	let inputNum = numToArrayBuffer(inputString);
  // console.log("inputNum is " + inputNum);
  var hashBytes = await window.crypto.subtle.digest("SHA-256", inputNum);

  // console.log(buf2hex(hashBytes));
  // console.log(buf2bin(hashBytes));
	return buf2bin(hashBytes);
}

var confettiOn = false;

var colors = ["#fbf274", "#d2abf8"];

function frame() {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
  });
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
  });

  if (Date.now() < Date.now() + 15000) {
    requestAnimationFrame(frame);
  }
}

function goldenNonce() {
	$('.office-banner').show();
	$('#winner').html($('#nonce-input').val())
  if (!confettiOn)
	  frame();
  confettiOn = true;
  $('canvas').show();
}

async function tryNonce() {
	const difficulty = $('#target').html();
	const nonce = $('#nonce-input').val();
	const difficultyBuffer = hex2buf(difficulty);

	let nonceHash = await shaMe(nonce);
	// console.log("the nonce is: " + nonce);
	// console.log("the hash is: " + nonceHash);

	const nonceHashBuffer = binString2buf(nonceHash);
	nonceHash = buf2hex(nonceHashBuffer);
	$('#hash').html(nonceHash);

  $('#target-compare').html(difficulty);
	if (compareBig(nonceHashBuffer, difficultyBuffer)) {
		$('#result-area').html(" <i style='color:#5ddd9d'><b>less than</b></i> ");
    $('#message').html("<span style='color:#5ddd9d'><i>YOU WON!</i> 🎉</span>");
		goldenNonce();
	}
	else {
		$('#result-area').html(" <i style='color:red'><b>not less than</b></i> ");
    $('#message').html("<i>TRY AGAIN</i> 🙅‍♀️");
	}

  $('#results-block').show();
  doLines();
}

// Try nonce on enter
var input = document.getElementById("nonce-input");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
		tryNonce();
  }
});

// show timestamp couter
function timestamp() {
	const d = new Date();
  let time = d.getTime();
	$('#epoch').html(parseInt(time/1000))
	setTimeout(timestamp, 1000);
}

timestamp();

// on mobile, break lines of hashes exactly halfway through
function breakLines() {
  $('.code').each(function() {
    var html = $(this).html();
    if (html.length > 32 && html.includes("<br>") == false) {
      html = html.substring(0, 32) + "<br>" + html.substring(32);
      $(this).html(html);
    }
  });
}

function glueLines() {
  $('.code').each(function() {
    var html = $(this).html();
    html = html.replace('<br>','');
    $(this).html(html);
  });
}

function doLines() {
  console.log('sup');
  var width = $(window).width();
  if (width <= 630) {
      breakLines();
  }
  else if (width > 630) {
    glueLines();
  }
}

$(window).resize(function() {
  doLines();
});

doLines();
</script>
</body>
</html>
