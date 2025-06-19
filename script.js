
let web3;
let userAccount;
const contractAddress = "0x27d82cc200033d8ecf6b5558ebe60ca212338a4f";

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    document.getElementById("wallet").innerText = "✅ Connected: " + userAccount;
    window.contract = new web3.eth.Contract(contractABI, contractAddress);
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}

async function stake() {
  const amount = document.getElementById("amount").value;
  const tier = document.getElementById("tier").value;
  if (!amount || amount <= 0) return alert("Enter valid amount");
  const tokenAddr = await contract.methods.token().call();
  const token = new web3.eth.Contract([
    {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],
     "name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}
  ], tokenAddr);
  const weiAmount = web3.utils.toWei(amount, "ether");
  await token.methods.approve(contractAddress, weiAmount).send({ from: userAccount });
  await contract.methods.stake(weiAmount, tier).send({ from: userAccount });
  alert("✅ Staked " + amount + " G3X for " + tier + " days.");
}

async function claim() {
  const count = await contract.methods.getStakeCount(userAccount).call();
  if (count == 0) return alert("No stake found");
  await contract.methods.claimRewards(0).send({ from: userAccount });
  alert("✅ Reward claimed");
}

async function unstake() {
  const count = await contract.methods.getStakeCount(userAccount).call();
  if (count == 0) return alert("No stake to unstake");
  await contract.methods.unstake(0).send({ from: userAccount });
  alert("✅ Unstaked");
}
