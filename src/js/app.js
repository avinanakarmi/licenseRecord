const truffleContract = require('truffle-contract');
const moment = require('moment');

const watchProvider = require('./provider.helper');


const source = require('../../build/contracts/LicenseRecord.json');


let instance = null //contract instance
let account = null //current account
let network = 'ropsten' //by default

//contract addresse of different network
let addresses = {
  localhost: '0x1AA1Ce8fea793D5C3dB8a8943581d577F41B0a06',
  rinkeby: '',
  kovan: '',
  ropsten: '0x1AA1Ce8fea793D5C3dB8a8943581d577F41B0a06',
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
    console.log(error);
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
  console.log(instance);

  //getting available accounts
  account = await watchProvider.getAccount()

  var path = window.location.pathname;
  var page = path.split("/").pop();
  if(page == "issue.html") {
    instance.isOfficer({from: account})
    .then((res) => {
      if(!res) {
        window.location = "http://localhost:3000/invalidAccess.html"
      }
      else {
        // instance.getAll({from: account})
        // .then((res) => {
        //   console.log(res);
        // })
        // .catch(err => {
        //   console.log(err);
        // })
        // getUserInfo();
        // instance.userCount()
        // .then((res) => {
        //   var count = res.s;
        //   for ( var i=1; i <= count; i++){
        //     console.log(instance.userRecord(i));
        //   }
        // })
        var licNo = prompt("Enter the license no. you would like to update", "");
        instance.checkStatus(licNo)
        .then((res) => {
          switch(res) {
            case "Not Registered": 
              document.getElementById("message").innerHTML = "<p>License Number: " + licNo + " is not registered.</p>"
              break;
            case "Registered but No Examination Passed":
                document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : " + res + "</p>"
                setTimeout(function() {
                  var r = confirm("Would you like to issue license G1?");
                if (r == true) {
                  instance.issueG1(licNo,true,{from: account})
                  .then((res) => {
                    alert("Successfully Issued!");
                    instance.checkStatus(licNo)
                    .then(res => {
                      document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : " + res + "</p>"
                    })
                  })
                  .catch(err => {
                    alert("Couldnot Issue License. Error occured");
                  })
                } else {
                }
                }, 3000);
                break;
            case "G1":
                document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : License Level " + res + "</p>"
                setTimeout(function() {
                  var r = confirm("Would you like to issue license G2?");
                if (r == true) {
                  instance.issueG2(licNo,true,{from: account})
                  .then((res) => {
                    alert("Successfully Issued!");
                    instance.checkStatus(licNo)
                    .then(res => {
                      document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : " + res + "</p>"
                    })
                  })
                  .catch(err => {
                    alert("Couldnot Issue License. Error occured");
                  })
                } else {
                }
                }, 3000);
                break;
            case "G2":
                document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : License Level " + res + "</p>"
                setTimeout(function() {
                  var r = confirm("Would you like to issue license G?");
                if (r == true) {
                  instance.issueG(licNo,true,{from: account})
                  .then((res) => {
                    alert("Successfully Issued!");
                    instance.checkStatus(licNo)
                    .then(res => {
                      document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : License Level" + res + "</p>"
                    })
                  })
                  .catch(err => {
                    alert("Couldnot Issue License. Error occured");
                  })
                } else {
                }
                }, 3000);
                break;
            case "G":
                document.getElementById("message").innerHTML = "<p>License Number: " + licNo + "</p><p>Current Status : License Level " + res + "</p>"
                break;
          }
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
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

  //checking web3 in browser
  if (!window.web3) {
    window.web3 = new window.Web3(provider)
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

async function issueG1Lic (licNo) {
  instance.issueG1(licNo, true, {from: account})
  .then((res) => {
    console.log(res)
  })
  .catch(err => {
    console.log(err);
  })
}

//issue license
async function issueLicense (element) {
  const uid = element.id;
  const fn = element.value;
  try {
    var message;
    switch(fn) {
      case "G1":
          message = instance.issueG1(uid,true);
      case "G2":
          message = instance.issueG2(uid,true);
      case "G":
          message = instance.issueG(uid,true);
      default:
          message = instance.validate(uid);
    }
    console.log(message);
  }
  catch(error) {
    console.log(error);
  }
}

const check = document.querySelector('#check')
check.addEventListener('submit', checkO, false)

//check user
async function checkO (event) {
  event.preventDefault()
  console.log("here");
  console.log(instance.checOfficer({from:account}));
}


//register user
async function getUserInfo () {
  var licNo = document.getElementById('licNo').value
  instance.checkStatus(licNo)
  .then(() => {
    console.log(res);
  })
}

