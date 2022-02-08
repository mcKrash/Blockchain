const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamps, data, previousHash = '') {
        this.index = index;
        this.timestamps = timestamps;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        //we will be using SHA256 to cryptograghic function to genarate hash of the block 
        return SHA256(this.index + this.timestamps + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineNewBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("a new block was mined with hash " + this.hash);
    }
}

class BlockChain {
    constructor() {
        //the first variable of the chain will be the genesis block & will be created manually 
        this.chain = [this.theGenesisBlock()];
        this.difficulty = 3;
    }

    theGenesisBlock() {
        return new Block(0, Date.now(), "This Is Genesis", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newblock) {
        newblock.previousHash = this.getLatestBlock().hash;
        newblock.mineNewBlock(this.difficulty);
        this.chain.push(newblock);
    }

    checkBlockChainValidation() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

        }
        return true;
    }

}

//creating new blocks
let block1 = new Block(1, Date.now(), { myBalance: 100 });
let block2 = new Block(2, Date.now(), { myBalance: 200 });


//creating new blockchain 
let myBlockchain = new BlockChain();

//adding blocks to the blockchain
console.log("the first block creation")
myBlockchain.addBlock(block1);
console.log("the second block creation")
myBlockchain.addBlock(block2);

console.log(JSON.stringify(myBlockchain, null, 4));

console.log("Blockchain validation Is " + myBlockchain.checkBlockChainValidation())