function encrypt(key, data){
	var aes = new pidCrypt.AES.CBC();
	var crypted = aes.encryptText(data, key, {nBits: 256}); 
	return crypted;
}

function decrypt(key, data){
	var aes = new pidCrypt.AES.CBC();
	var plain = aes.decryptText(data, key, {nBits: 256});
	return plain;
}