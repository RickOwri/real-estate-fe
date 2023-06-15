import { ethers } from 'ethers';
import LTK from '../assets/LotteryToken.json';
import lotteryJson from '../assets/Lottery.json';
// import lotteryJson from '../assets/Lottery.json';
import { useState } from 'react';
import dotenv from "dotenv";
import { useSigner, useNetwork, useBalance } from 'wagmi';

export function WithdrawTokens() {
    const { data: signer } = useSigner();
    const [txData, setTxData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [amountToWithdraw, setAmountToWithdraw] = useState("")

    const chainId1 = 80001; 

    const provider = new ethers.providers.AlchemyProvider(
        chainId1,
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);

    const token = new ethers.Contract(
        process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
        LTK.abi,
        provider);

    const lotteryContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_BET_CONTRACT_ADDRESS,
        lotteryJson.abi,
        provider);

    const handleAmountToWithdraw = (event) => {
        setAmountToWithdraw(event.target.value);
        };


    if (txData) return (
        <>
            <p>Withdraw confirmed ({txData.transactionHash})</p>
            <a href={"https://mumbai.polygonscan.com/tx/" + txData.transactionHash} target="_blank">{txData.transactionHash}</a>
        </>
    )
    if (isLoading) return (
        <>
            <>Withdraw loaded...
            </>
        </>
    );
    return (
        <>
            <p><input type="text" value={amountToWithdraw} onChange={handleAmountToWithdraw} />Token Amount To withdraw </p>

            <button onClick={() => withdrawTokens(signer, lotteryContract, amountToWithdraw, setTxData, setLoading)}>withdrawTokens</button>
        </>
    );
}

async function withdrawTokens(signer, contract, amount, setTxData, setLoading) {
    setLoading(true);
    console.log(ethers.utils.parseEther(amount))
    const tx = await contract.connect(signer).ownerWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    setTxData(receipt)
    setLoading(false)
}
