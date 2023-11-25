const {ethers} = require("hardhat");

async function main(){
    const [owner1, owner2, owner3] = await ethers.getSigners();
    console.log("Owner: " + owner1.address + " \nOwner2: " + owner2.address + " \nOwner3: " + owner3.address);
    console.log();

    const XYZFactory = await ethers.getContractFactory('XYZ', owner1);
    const XYZ = await XYZFactory.deploy();
    const XYZTokenAddress = await XYZ.getAddress();
    console.log("XYZ Token Address: ", XYZTokenAddress);

    const WalletFactory = await ethers.getContractFactory('SmartWallet', owner1);
    const Wallet = await WalletFactory.deploy();
    const WalletAddress = await Wallet.getAddress();
    console.log("Wallet Address: ", WalletAddress);
    console.log("Wallet Owner Address: ", await Wallet.owner()); 

    await XYZ.connect(owner1).mint(
        owner1.address,
        ethers.parseEther('1250')
    );

    console.log("Owner's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(owner1.address)));



    /* ======== Script Section 1 : Token Transaction ======== */ 

    /*
    await XYZ.connect(owner).transfer(
        WalletAddress,
        ethers.parseEther('100')
    )
    */

    // 1st token deposit to smart wallet
    await XYZ.approve(WalletAddress, ethers.parseEther('100'));
    await Wallet.depositToken(XYZTokenAddress, ethers.parseEther('100'));

    console.log("1st token transfer: 100 $XYZ to smart wallet. ")
    console.log("Owner's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(owner1.address)));
    console.log("Wallet's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(WalletAddress)));
    //console.log("Test getTokenBalance: ", ethers.formatEther(await Wallet.getTokenBalance(XYZTokenAddress)));

    console.log("");

    // 2nd token deposit to smart wallet
    await XYZ.approve(WalletAddress, ethers.parseEther('150'));
    await Wallet.depositToken(XYZTokenAddress, ethers.parseEther('150'));

    console.log("2nd token transfer: 150 $XYZ to smart wallet.")
    console.log("Owner's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(owner1.address)));
    console.log("Wallet's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(WalletAddress)));

    console.log("");

    // 3rd token deposit to smart wallet
    await XYZ.approve(WalletAddress, ethers.parseEther('120'));
    await Wallet.depositToken(XYZTokenAddress, ethers.parseEther('120'));

    console.log("3rd token transfer: 120 $XYZ to smart wallet.")
    console.log("Owner's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(owner1.address)));
    console.log("Wallet's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(WalletAddress)));

    console.log("");

    // show historical token deposits to smart wallet
    // console.log(await Wallet.showTokenDeposits());
    console.log("Showing token deposits...")
    var tempArr = await Wallet.showTokenDeposits();
    var tempLen = tempArr.length;
    for (var i = 0; i < tempLen; ++i) {
        console.log("Deposit " + (i+1) + " : " + ethers.formatEther(tempArr[i]));
    }      

    console.log();

    // withdraw 8 $XYZ
    await Wallet.withdrawTokenToOwner(XYZTokenAddress, ethers.parseEther('8'));
    console.log("Withdrawing 8 $XYZ from smart wallet to owner...");
    console.log("Owner's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(owner1.address)));
    console.log("Wallet's XYZ Token Balance: ", ethers.formatEther(await XYZ.balanceOf(WalletAddress)));

    console.log("");



    /* ======== Script Section 2 : ETH Transaction ======== */

    // 1st ETH deposit to smart wallet
    sendEth = await owner1.sendTransaction({
        to: WalletAddress,
        value: ethers.parseEther("1")
    })
    console.log("1st ETH transfer: 1 ETH to smart wallet.")
    console.log("1st Transaction Hash: ", sendEth.hash);
    console.log("Owner's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(owner1.address)));
    console.log("Wallet's ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("");
    
    // 2nd ETH deposit to smart wallet
    sendEth = await owner1.sendTransaction({
        to: WalletAddress,
        value: ethers.parseEther("3")
    })
    console.log("2nd ETH transfer: 3 ETH to smart wallet.")
    console.log("2nd Transaction Hash: ", sendEth.hash);
    console.log("Owner's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(owner1.address)));
    console.log("Wallet's ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("");

    // 3rd ETH deposit to smart wallet
    sendEth = await owner1.sendTransaction({
        to: WalletAddress,
        value: ethers.parseEther("5")
    })
    console.log("3rd ETH transfer: 5 ETH to smart wallet.")
    console.log("3rd Transaction Hash: ", sendEth.hash);
    console.log("Owner's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(owner1.address)));
    console.log("Wallet's ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("");
    
    // show historical ETH deposits to smart wallet
    console.log("Total ETH Deposits : " + ethers.formatEther(await Wallet.showEthDeposits(owner1)) + " ; received from " + owner1.address);

    // withdraw 2 ETH
    await Wallet.withdrawEthToOwner(ethers.parseEther('2'));
    console.log("Withdrawing 2 ETH from smart wallet to owner...");
    console.log("Owner's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(owner1.address)));
    console.log("Wallet's ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });