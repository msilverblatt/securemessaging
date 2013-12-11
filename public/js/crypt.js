//AES
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

//RSA
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

function generateSymKey(len) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
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
        var crypted = rsa.encrypt(plain);
        var returner = pidCryptUtil.fragment(pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted)),64);
        return returner;
       } else return "";
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
        return decrypted;
       } else return "";
}

var private_key = '-----BEGIN RSA PRIVATE KEY-----\n\
MIIEowIBAAKCAQEAo8nRC93BSBG8kuLSkoL2Lx5Eni3Zuc48p01jetrUl3i/6krO\n\
5YwUbnPleYdkIocfYlyLDSICExADxabBTwNJPbeFtmpFCjQYstwzKko1r3yJVJuZ\n\
ArKBPPeXSRmGEPZR7TO+TItXU2lfbTRhQUyFySN+Z7tpqKBXpIQURaVpVfpV7SeJ\n\
Wif+uKMUU8beC0QlkhSvHiOqgBHWjSsRXuDZErjpyPSdakZoXneKyGe90DYaUqfO\n\
L5hwJonRHjv7N0arHzbzUDPaX8OMqPUBePbSs3w57tq+8Q/A/TPo/O1aHSZ3Bns3\n\
Xag8moNEORiJ/uexv8EoISVWOz7eR51K14zPHwIDAQABAoIBAH6kADftmZHQ7P6h\n\
1PElw5ZBEAtCJnPNLAasBrwqUXBhE/rjJsBEJFQW1pq1/c3YroKOTZG09ueoXVJJ\n\
EnS2dL38la2q04EFMQeyzPjo8kOixkieGpwES3tJcTc7PfcFjekbNgvXPYkoE3nL\n\
o1srANK51/X66cJRYBK7cTU8pYqszQuaWlZYKzwrzxd4jhdIiRkb+zAG2+PXgPPM\n\
ajI8zX45LyGAhFcgxt2JXtqizvBHaxcR6CL5egZe2NDJamq1RAXOiGV3BGOqNckb\n\
WkPYmF+yM54c1r5dJmmhpaPyIF2caGqnqHrxdqa3DUCDNivO6GrphApaBCXC9ZHH\n\
7PZiS9kCgYEA14JDGE6XJ1h9+MobcOQ6M4raVcYM2tR0YfmDPgXfRVRNc34ibVaF\n\
7EoB3aRwELz174fln4K4c9Yq6BZetH1ZoTIHm8UO+9ZvOjTVzg5xQDk/xC6GKL/A\n\
QvuOEADiR+lkN/Vus8eKeYfp0ieQz83OYVVVJdrJmE1FT81/nr8Wqb0CgYEAwo/b\n\
FzOyQeKaPzlDh3bRHlyAD19nd4Ee5hVmMKUMgtHKcBmgXu5i/1l5TobPwyrKiiGC\n\
8LpvvDcGh5bvktbOBVbDjSzyiCn8KZOGP+nrM8BCUEtPAo/ibkaOi+C/m5kDGUb+\n\
ZzDsy4YUWxlnZrKBZjstCn6/nhAMztxrly2/1AsCgYAkvMv7RMp3ppoy4yEyaXWS\n\
e8UkghKG61i7qvE4jX+2LdzWJ1ZvFSTXVvZidjm0YMH8B0qZmosfFA9UaRvT4Np6\n\
pDCv2TPosnFbls4rxkKAFEJOiy/LmoSH5qIdEEmCwMKY13n7o7Rzazvs21nQUuEv\n\
roBJZ7aeA+4g4IM06JZQcQKBgQCEAr2iIYZ6o7kK2tzR5jF/iz2ssIvwjuCbNrvO\n\
l75EaPoVU533q4HqRhhDyr7faoJgdNp2Ydl8eE1q5GOLW0oQX01x1aR99RbOUvWN\n\
GjdnNrUH7AEg+OWm8yK3D/iSJ6Dtnrjw5UZV1ZSsNzFsggPAjLhD3bpAEh3Oocoy\n\
mm0E/wKBgGByZ91ABS7XUrqrjAbnrlJ/UBm2bTAOC6lSB1KzzI7VRwe44SpJRYc+\n\
bYaE0IxFFyf0dHPqw03MDX3lgtN+RwvUnveitSWVlKtzqiCFABA6MnRticlRBUJi\n\
tDiYGnVU6Enfiv3tcdiD2RM3eO8IErkxeUxVP4ALqcYlxdeN6NlH\n\
-----END RSA PRIVATE KEY-----';

var public_key = '-----BEGIN PUBLIC KEY-----\n\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8nRC93BSBG8kuLSkoL2\n\
Lx5Eni3Zuc48p01jetrUl3i/6krO5YwUbnPleYdkIocfYlyLDSICExADxabBTwNJ\n\
PbeFtmpFCjQYstwzKko1r3yJVJuZArKBPPeXSRmGEPZR7TO+TItXU2lfbTRhQUyF\n\
ySN+Z7tpqKBXpIQURaVpVfpV7SeJWif+uKMUU8beC0QlkhSvHiOqgBHWjSsRXuDZ\n\
ErjpyPSdakZoXneKyGe90DYaUqfOL5hwJonRHjv7N0arHzbzUDPaX8OMqPUBePbS\n\
s3w57tq+8Q/A/TPo/O1aHSZ3Bns3Xag8moNEORiJ/uexv8EoISVWOz7eR51K14zP\n\
HwIDAQAB\n\
-----END PUBLIC KEY-----';

// The passphrase used to repeatably generate this RSA key.
var PassPhrase = "The Moon is a Harsh Mistress.";

// The length of the RSA key, in bits.
var Bits = 1024;

var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);

var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);

var PlainText = "Matt, I need you to help me with my Starcraft strategy.";

var EncryptionResult = cryptico.encrypt(PlainText, MattsPublicKeyString);

var DecryptionResult = cryptico.decrypt(EncryptionResult.cipher, MattsRSAkey);
