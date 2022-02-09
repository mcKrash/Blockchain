const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamps, transactions, previousHash = '') {
        this.timestamps = timestamps;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        //we will be using SHA256 to cryptograghic function to genarate hash of the block 
        return SHA256(this.timestamps + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.penddingTransactions = [];
        this.difficulty = 3;
        this.miningReward = 10;
    }

    theGenesisBlock() {
        return new Block(Date.now(), "This Is Genesis", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePenddingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.penddingTransactions, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block Mined Successfully");
        this.chain.push(block);

        this.penddingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    creareTransaction(transaction) {
        this.penddingTransactions.push(transaction);
    }

    getBalanceFromAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance = balance - trans.amount
                }
                if (trans.toAddress === address) {
                    balance = balance + trans.amount
                }
            }
        }
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



let bittyCoin = new BlockChain()

transaction1 = new Transaction("tom", "jhon", 100);
bittyCoin.creareTransaction(transaction1);

transaction2 = new Transaction("jhon", "tom", 200);
bittyCoin.creareTransaction(transaction2);

console.log("miner just satrt mining");
bittyCoin.minePenddingTransactions("donald");

console.log("balance for tom is: " + bittyCoin.getBalanceFromAddress("tom"));
console.log("balance for jhon is: " + bittyCoin.getBalanceFromAddress("jhon"));
console.log("balance for miner donald is: " + bittyCoin.getBalanceFromAddress("donald"));

console.log("miner just satrt mining again");
bittyCoin.minePenddingTransactions("donald");
console.log("balance for miner donald is: " + bittyCoin.getBalanceFromAddress("donald"));