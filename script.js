
let web3;
let contract;
let userAccount;
const contractAddress = "0x27d82cc200033d8ecf6b5558ebe60ca212338a4f";

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("wallet").innerText = "✅ Connected: " + userAccount;
  } else {
    alert("Install MetaMask.");
  }
}

async function stake() {
  const amount = document.getElementById("amount").value;
  const tier = document.getElementById("tier").value;
  if (!amount || isNaN(amount)) {
    alert("Invalid amount");
    return;
  }

  const stakeAmount = web3.utils.toWei(amount, "ether");
  const tokenAddress = await contract.methods.token().call();
  const tokenContract = new web3.eth.Contract([
    { "constant": false, "inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}], "name":"approve","outputs":[{"name":"","type":"bool"}], "type":"function" }
  ], tokenAddress);

  await tokenContract.methods.approve(contractAddress, stakeAmount).send({ from: userAccount });
  await contract.methods.stake(stakeAmount, tier).send({ from: userAccount });
  alert("✅ Staked " + amount + " G3X for " + tier + " days.");
}

async function claim() {
  const stakeCount = await contract.methods.getStakeCount(userAccount).call();
  if (stakeCount == 0) {
    alert("No stake found.");
    return;
  }
  await contract.methods.claimRewards(0).send({ from: userAccount });
  alert("🎉 Reward claimed.");
}

async function unstake() {
  const stakeCount = await contract.methods.getStakeCount(userAccount).call();
  if (stakeCount == 0) {
    alert("Nothing to unstake.");
    return;
  }
  await contract.methods.unstake(0).send({ from: userAccount });
  alert("🔓 Unstaked.");
}
