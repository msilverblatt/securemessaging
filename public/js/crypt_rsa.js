function generateSymKey(len) {
	charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz,randomPoz+1);
	}
	return randomString;
}

function certParser(cert){
  var lines = cert.split('\n');
  var read = false;
  var b64 = false;
  var end = false;
  var flag = '';
  var retObj = {};
  retObj.info = '';
  retObj.salt = '';
  retObj.iv;
  retObj.b64 = '';
  retObj.aes = false;
  retObj.mode = '';
  retObj.bits = 0;
  for(var i=0; i< lines.length; i++){
    flag = lines[i].substr(0,9);
    if(i==1 && flag != 'Proc-Type' && flag.indexOf('M') == 0)//unencrypted cert?
      b64 = true;
    switch(flag){
      case '-----BEGI':
        read = true;
        break;
      case 'Proc-Type':
        if(read)
          retObj.info = lines[i];
        break;
      case 'DEK-Info:':
        if(read){
          var tmp = lines[i].split(',');
          var dek = tmp[0].split(': ');
          var aes = dek[1].split('-');
          retObj.aes = (aes[0] == 'AES')?true:false;
          retObj.mode = aes[2];
          retObj.bits = parseInt(aes[1]);
          retObj.salt = tmp[1].substr(0,16);
          retObj.iv = tmp[1];
        }
        break;
      case '':
        if(read)
          b64 = true;
        break;
      case '-----END ':
        if(read){
          b64 = false;
          read = false;
        }
      break;
      default:
        if(read && b64)
          retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i]);
    }
  }
  return retObj;
}

function showData(tree) {
  var data = '';
  var val = '';
  if(tree.value)
   val = tree.value;
  data += tree.type + ':' +  val.substr(0,48) + '...\n';
  if(tree.sub)
    for(var i=0;i<tree.sub.length;i++)
      data += showData(tree.sub[i]);
  return data;
}


function symmetricEncrypt(key, data){
	var aes = new pidCrypt.AES.CBC();
	var crypted = aes.encryptText(data, key, {nBits: 256}); 
	return crypted;
}

function symmetricDecrypt(key, data){
	var aes = new pidCrypt.AES.CBC();
	var plain = aes.decryptText(data, key, {nBits: 256});
	return plain;
}

function encryptAsymmetric(plain, pubkey){
	var params = {};
  	var result = '';
	params = certParser(pubkey);
      if(params.b64){
        var key = pidCryptUtil.decodeBase64(params.b64);
        //new RSA instance
        var rsa = new pidCrypt.RSA();
        //RSA encryption
        //ASN1 parsing
        var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
        var tree = asn.toHexTree();
        //setting the public key for encryption
        rsa.setPublicKeyFromASN(tree);
        varcrypted = rsa.encrypt(plain);
        console.log(crypted);
        return crypted;
       } else alert('Could not find public key.');
}

function decryptAsymmetric(crypted, privkey){
	var params = {};
  	var result = '';
	params = certParser(privkey);
     if(params.b64){
        var key = pidCryptUtil.decodeBase64(params.b64);
        var rsa = new pidCrypt.RSA();
        //RSA decryption
        //ASN1 parsing
        var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
        var tree = asn.toHexTree();
        //alert(showData(tree));
        //setting the private key for encryption
        rsa.setPrivateKeyFromASN(tree);
        crypted = pidCryptUtil.decodeBase64(pidCryptUtil.stripLineFeeds(crypted));
        var decrypted = rsa.decrypt(pidCryptUtil.convertToHex(crypted));
        console.log(decrypted);
        return decrypted;
      }  else alert('Could not find private key.');
}

function formatString(str)
{
  var tmp='';
  for(var i=0;i<str.length;i+=80)
    tmp += '   ' + str.substr(i,80) +'\n';
  return tmp;
}