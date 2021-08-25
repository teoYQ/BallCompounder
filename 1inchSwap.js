/** NodeJS example of using the 1INCH API with web3{js} */
const axios = require('axios');                         //used for getting api data, install with "yarn add axios"
const { ethers } = require('ethers');                   //full ethereum wallet written as a javascript module, documentation here: https://docs.ethers.io/v5/getting-started/

var privateKey = '';                               //private key in hex with a leading 0x

// Sign up for a free dedicated RPC URL at https://rpc.maticvigil.com/, https://ankr.com, https://infura.io/ or other hosted node providers.
const MATICprovider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/'); //rpc can be replaced with an ETH or BSC RPC 
const wallet = new ethers.Wallet(privateKey, MATICprovider);       //connect the matic provider along with using the private key as a signer

const amt = 1000000000000000000 //this is 1
//the URL of the tokens you may want to swap, change if the provider isn't matic
let callURL = "https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=0x883aBe4168705d2e5dA925d28538B7a6AA9d8419&toTokenAddress=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&amount="+ amt +"&fromAddress=" +
wallet.address +
'&slippage=1';

/*'https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&' +
    'toTokenAddress=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&' +
    'amount=10000000000000&fromAddress=' +
    wallet.address +
    '&slippage=1';*/

/**
 * The driver of the program, this will execute anything you put in it
 */
async function driver(amount,tokenToSell) {

    // only tokens need approval, MATIC does not
    //begin token approval
   /* if (!(callURL.substring(callURL.indexOf("fromTokenAddress=") + 17, callURL.indexOf("fromTokenAddress=") + 59) === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')) //check if this is not the native token
    {
        nonce = await wallet.getTransactionCount() + 1;
        globalData = await approveApiCaller(amt, address, nonce)
        console.log(globalData);
        try {
            await wallet.sendTransaction(globalData["tx"]).then(
                (data) => {                                 //catch any errors
                    console.log(data);
                }
            );                                              //send the transaction
            console.log("Approval success");
        } catch (e) {
            console.log("Approval failure");
        }
    }//end token approval*/

    //begin api call and transaction sending
    amountToSwap = amount * 1000000000000000000
    const ballContract = '0x883aBe4168705d2e5dA925d28538B7a6AA9d8419'
    const shieldContract = '0xF239E69ce434c7Fb408b05a0Da416b14917d934e'
    var sellContract 
    if(tokenToSell = 'shield'){
        sellContract = shieldContract;
    }
    else{
        sellContract = ballContract
    }
    const maticContract = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
    let callURL = "https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=" +sellContract +"&toTokenAddress=" + maticContract +"&amount="+ amountToSwap +"&fromAddress=" +
    wallet.address +
    '&slippage=1';
    nonce = await wallet.getTransactionCount() + 1;
    globalData = await apiCaller(callURL, nonce);       //call the api to get the data, and wait until it returns
    //console.log(globalData["tx"]);                    //log the data
    try {
        await wallet.sendTransaction(globalData["tx"]).then(
            (data) => {                                 //catch any errors
                console.log(data);
            }
        );                                              //send the transaction
        console.log("Transaction success");
    } catch (e) {
        console.log("Transaction failure");
        console.log(globalData)
        console.log(e)
    }
    //end api call and transaction sending
    process.exit(0);                                    //exit with code 0
}

/**
 * This will call the api to get an approve transaction, some tokens need to be approved to 0 before increasing again later
 * @param {the number of tokens that are requested to be unlocked, if "null" infinite will be unlocked } value 
 * @param {the token address of what tokens needs to be unlocked} tokenAddress
 * @param {the nonce of the transaction} nonce
 * @returns approve transaction data
 */
async function approveApiCaller(value, tokenAddress, nonce) {
    let url = 'https://api.1inch.exchange/v3.0/1/approve/calldata' +
        (value > -1 && value != null ? "?amount=" + value + "&" : "") //tack on the value if it's greater than -1
        + "tokenAddress=" + tokenAddress            //complete the called URL
    let temp = await axios.get(url);                //get the api call
    temp = temp.data;                               //we only want the data object from the api call
    //we need to convert the gasPrice to hex
    delete temp.tx.gasPrice;
    delete temp.tx.gas;                             //ethersjs will find the gasLimit for users

    //we also need value in the form of hex
    let val = parseInt(temp.tx["value"]);			//get the value from the transaction
    val = '0x' + val.toString(16);				    //add a leading 0x after converting from decimal to hexadecimal
    temp.tx["value"] = val;						    //set the value of value in the transaction object

    return temp;                                    //return the data
}

/**
 * Will call the api and return the data needed
 * @param {the url of what api call you want} url 
 * @param {the nonce of the transaction, the user must keep track of this} nonce
 * @returns swap transaction
 */
async function apiCaller(url, nonce) {
    let temp = await axios.get(url);                //get the api call
    temp = temp.data;                               //we only want the data object from the api call
    delete temp.tx.gasPrice;                        //ethersjs will find the gasPrice needed
    delete temp.tx.gas;                             //ethersjs will find the gasLimit for users

    //we also need value in the form of hex
    let value = parseInt(temp.tx["value"]);			//get the value from the transaction
    value = '0x' + value.toString(16);				//add a leading 0x after converting from decimal to hexadecimal
    temp.tx["value"] = value;						//set the value of value in the transaction object. value referrs to how many of the native token

    //temp.tx["nonce"] = nonce;                     //ethersjs will find the nonce for the user
    //temp.tx.chainId = 137                         //this allows the transaction to NOT be replayed on other chains, ethersjs will find it for the user
    return temp;                                    //return the data
}

driver(0.01,'shield');