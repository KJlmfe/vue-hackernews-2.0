import Web3 from 'web3';
import kittyAbi from './abi/kitty.json';
import auctionAbi from './abi/auction.json';

// const rpc = "https://api.myetherapi.com/eth";
const rpc = "https://mainnet.infura.io/WtTerXFEBdFeRdCPm58K";

const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const KittyContract = new web3.eth.Contract(kittyAbi, '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d');
const AuctionContract = new web3.eth.Contract(auctionAbi, '0xb1690c08e213a35ed9bab7b318de14420fb57d8c');

export function fetchItem(id) {
    return Promise.all([
        KittyContract.methods.getKitty(id).call(),
        // KittyContract.methods.kittyIndexToOwner(id).call(),
        // AuctionContract.methods.getAuction(id).call()
    ]).then(([item, owner, auction]) => {
        item.id = id;
        // item.owner = owner;
        // item.auction = auction;
        return item;
    });
}

export function fetchList(type) {
    if (type === 'all') {
        return KittyContract.methods.totalSupply().call().then((total) => {
            total = Number(total);
            return Array.from(new Array(total), (val, index) => (index + 1));
        });
    } else {
        return Promise.reject(`Unknown list type: ${type}`);
    }
}