'use strict';
import Base58 from '../deps/Base58.js'
import { Sha256, Sha512 } from 'asmcrypto.js'
import jsSHA from "jssha";
import RIPEMD160 from '../deps/ripemd160.js'
import utils from '../deps/utils.js'
import { EllipticCurve, BigInteger } from './ecbn.js';
import '../deps/sha3.js'

export default class QRLWallet {
  
  createQrlWallet(seed, isBIP44, indicator = null) {
    
        // Set Seeed
        this.setSeed(seed)

        // Generate Seed Hash
        this.generateSeedHash(this.seed, isBIP44, indicator)

        // Generate Private Key
        this.generatePrivateKey(this.seedHash)

        // Generate Chain Code
        this.generateChainCode(this.seedHash)

        // Generate Public Key from Private Key
        this.generatePublicKey(this.privateKey)

        // Generate Mainnet Master Private Key
        this.generateMainnetMasterPrivateKey()

        // Generate Mainnet Master Public Key
        this.generateMainnetMasterPublicKey()

        // Generate Testnet Master Private Key
        this.generateTestnetMasterPrivateKey()

        // Generate Testnet Master Public Key
        this.generateTestnetMasterPublicKey()

        // Generate Child and Grand Child Keys
        this.generateDerivedChildKeys()

        // Return Wallet Object Specification
        return this.returnWallet()
    }
  
    if(indicator !== null) {
    const indicatorString = utils.stringtoUTF8Array(indicator);
    buffer = utils.appendBuffer(seed.reverse(), indicatorString);
    }
