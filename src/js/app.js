const truffleContract = require('truffle-contract');
const moment = require('moment');

const watchProvider = require('./provider.helper');


const source = require('../../build/contracts/LicenseRecord.json');


let instance = null //contract instance
let account = null //current account
let network = 'ropsten' //by default

//contract addresse of different network
let addresses = {
  localhost: '<CONTRACT_ADDRESS>',
  rinkeby: '',
  kovan: '',
  ropsten: '<CONTRACT_ADDRESS>',
  mainnet: ''
}

//wait for metamask
window.addEventListener('load', onLoad)


async function onLoad () {
  try {
    await init()
  } 
  catch (error) {
    // alert(error.message)
    console.log("error",error);
  }
}


//initializing contract
async function init () {
  contract = truffleContract(source);
  console.log("display contract",contract)

  provider = watchProvider.getProvider()
  contract.setProvider(provider)

  contractAddress = addresses[network]

  //creating instance of contract at given address.
  instance = await contract.at(contractAddress)
  console.log("instance", instance);

  //getting available accounts
  account = await watchProvider.getAccount()

  //checking web3 in browser
  if (!window.web3) {
    window.web3 = new window.Web3(provider)
  }

  render();
}

function render() {
  var path = window.location.href;
  var page = path.split("/").pop();
  if(page === "issue.html") {
    instance.isOfficer({from: account})
    .then((res) => {
      if(!res) {
        window.location = "http://localhost:3000/invalidAccess.html"
      }
      else {
        window.location = "http://localhost:3000/inventory.html"
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
  else if (page.match(/(inventory)\.(html)/)) {
    
    instance.isOfficer({from: account})
    .then((res) => {
      if(!res) {
        window.location = "http://localhost:3000/invalidAccess.html"
      }
      else {
        const searchForm = document.querySelector('#searchUser')
        searchForm.addEventListener('submit', searchUser, false)
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
  else if (page.match(/(upgradeLicenseStatus)\.(html)/)){
    var query = path.split("?").pop();
    var addr = query.split("&").shift();
    var status = query.split("&").pop().replace(/%20/g, " ");
    issueLicense(addr, status)
  }
  else {
    document.querySelector('#address').innerHTML = account;

    if (!account) {
      alert('Metamask not Connected');
      return false
    }
    
    instance.checkStatus(account)
    .then((res) => {
      console.log(res);
      document.querySelector('#status').innerHTML = res;
      if(res == "Not Registered") {
        document.querySelector('#form').style.display = "block";
      }
    })
  }
}



//update the account when the current account is changed in metamask
window.ethereum.on('accountsChanged', async function (accounts) {
  console.log(accounts);
  account = await watchProvider.getAccount()
  init();
})

const registerForm = document.querySelector('#registerForm')
registerForm.addEventListener('submit', registerUser, false)

//register user
async function registerUser (event) {
  event.preventDefault()
  const name = registerForm.name.value;
  const phone = registerForm.phone.value;

    instance.register(name,phone,{from: account})
    .then((res) => {
      console.log("response")
      console.log(res);
      // alert("Registerd");
    })
    .catch((err) => {
      console.log(err);
    })
}

//issue license
async function issueLicense (addr, status) {
  try {
    switch(status) {
      case "Registered but No Examination Passed":
        instance.issueG1(addr,true, {from : account})
        .then((res) => {
          window.location = "http://localhost:3000/inventory.html"
        })
        .catch((err) => {
          window.location = "http://localhost:3000/error.html"
        })
        break;
      case "G1":
        instance.issueG2(addr,true, {from : account})
        .then((res) => {
          window.location = "http://localhost:3000/inventory.html"
        })
        .catch((err) => {
          window.location = "http://localhost:3000/error.html"
        })
        break;
      case "G2":
        instance.issueG(addr,true, {from : account})
        .then((res) => {
          window.location = "http://localhost:3000/inventory.html"
        })
        .catch((err) => {
          window.location = "http://localhost:3000/error.html"
        })
        break;
      default:
        instance.issueG1(addr,true, {from : account})
        .then((res) => {
          alert(`${addr} is ${res}`)
        })
        .catch((err) => {
          window.location = "http://localhost:3000/error.html"
        })
    }
  }
  catch(error) {
    console.log(error);
  }
}

function searchUser (event) {
  event.preventDefault()
  searchForm = document.querySelector('#searchUser')
  searchAddr = searchForm.userAddress.value;

  instance.checkStatus(searchAddr)
  .then((res) => {
    document.querySelector("#info").style.display = "block";
    document.querySelector('#searchedAddress').innerHTML = searchAddr;
    document.querySelector('#searchedAddressStatus').innerHTML = res;

    var action = "";
    switch(res) {
      case "Not Registered":
        action = "Not Registered";
        break;
      case "Registered but No Examination Passed":
        action = "Issue G1";
        break;
      case "G1":
        action = "Issue G2";
        break;
      case "G2":
        action = "Issue G";
        break;
      default:
        action = "Validate";
    }
    document.querySelector("#addressAction").href = "upgradeLicenseStatus.html?" + searchAddr + "&" + res;
    if (res === "Not Registered"){
      document.querySelector('#addressAction').innerHTML = '<button class="btn btn-primary" disabled>' + action + '</button>';
    } else {
      document.querySelector('#addressAction').innerHTML = '<button class="btn btn-primary" type="submit" value="search">' + action + '</button>';
    }
  })
}