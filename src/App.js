import {useState, useEffect} from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Abi from "./ABI/abi.json";
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers'
import Header from './components/Header';
import Profile from './components/Profile';
import Main from './components/Main';
import Profiles from "./components/Profiles";

function App() {



    toast.configure();

  const contractAddress = "0xf1E113663725939195f4c6C8684F6e822bE6ae3d";
  
  // profile form data state
  const [newProfileData, setNewProfileData] = useState({
    firstName: "",
    lastName: ""
  })

  //  currently conected user
  const [userAccount, setUserAccount] = useState({
    address: null,
    balance: null
  })


  const [wrongNetworkNotice, setWrongNetworkNotice] = useState(false);

  const [loaderState, setLoaderState] = useState(false)

   // all profiles
   const [profiles, setProfiles] = useState([])


   const connectWallet = async () => {

    if(!window.web3 || !window.ethereum) return;
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
     
      provider.on("network", (newNetwork, oldNetwork) => {
          if (oldNetwork) {
              window.location.reload();
          }
      });

      const {chainId} = await provider.getNetwork()
      const accounts = await provider.listAccounts() 
        if(accounts.length) {
  
          if(Number(chainId) === 4) {
            const balance = await provider.getBalance(accounts[0]);
            setUserAccount({
              address: accounts[0],
              balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
            })
            setWrongNetworkNotice(false)
          } else {
            setUserAccount({
              address: null,
              balance: null
            })
            setWrongNetworkNotice(true)
            toast.error('You are connected to the wrong network, please switch to Rinkeby Network')
            console.log("handleChainChanged")
          }
        }
      console.log(await window.ethereum.request({ method: 'eth_requestAccounts' }))
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // the event handler resposible for accountChanged event will pick up from here
    } catch (err) {
      console.log(err)
    }
  }

  const onNamesChange = (e) => {
    const {name} = e.target

    switch(name) {
      case "firstName" :
        setNewProfileData({...newProfileData, firstName: e.target.value})
        break;

      case "lastName" :
        setNewProfileData({...newProfileData, lastName: e.target.value})
        break;

      default:
        break;
    }
  }

  
  const createProfile = async () => {
    
    if(!newProfileData.firstName || !newProfileData.lastName) return toast.error("please fill out all fields appropriately");
    if(userAccount.balance < 0.01) return toast.error("Insufficient Ether balance, at least 0.01ETH is needed");
    
    const myAddress = profiles.find(profile => profile.profileAddress === userAccount.address)
    
    if(myAddress) return toast.error("Profile already created for this account");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Abi, signer);

    try {
      const amountWEI = ethers.utils.parseUnits("0.01" , "ether" ).toString()
      const profileTX = await contract.createProfile(newProfileData.lastName, newProfileData.firstName, {value: amountWEI})

      const txHash = await provider.getTransaction(profileTX.hash);

      if(txHash) setLoaderState(true);

      await profileTX.wait()

      const txReceipt = await provider.getTransactionReceipt(profileTX.hash);

      setLoaderState(false);
      setNewProfileData({
        firstName: "",
        lastName: ""
      })


      if (txReceipt && txReceipt.blockNumber) {

        const newbBalance = await provider.getBalance(userAccount.address);
        setUserAccount(prev => ({...prev, balance: parseFloat(ethers.utils.formatEther(newbBalance)).toFixed(2)})) //updating user balance
        toast.success('Profile created ')
    } else {
      toast.error('Something went wrong')
    }
    } catch(error) {
        setLoaderState(false);
        toast.error('Something went wrong')
        console.log("error: ", error)
        setNewProfileData({
          firstName: "",
          lastName: ""
        })
    }
  }  


  const delteMyProfile = async (profileAddress, profileId) => {

    try {
      
       if(profileAddress === userAccount.address) {
         
       
                
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, Abi, signer);
    
          const profileTX = await contract.delteMyProfile()
  
          const txHash = await provider.getTransaction(profileTX.hash);
  
          if(txHash) setLoaderState(true);
  
          await profileTX.wait()
  
          const txReceipt = await provider.getTransactionReceipt(profileTX.hash);

    
          
          setProfiles(profiles.filter((profile) => profile.profileId !== profileId));
         
  
          setLoaderState(false);
  
          if (txReceipt && txReceipt.blockNumber) {
            toast.success('Profile Deleted')
          } else {
            toast.error('Something went wrong')
          }
          
       }else{
        toast.error("User can only delete their own record");
       }

     

    } catch (error) {
      setLoaderState(false);
      toast.error('Something went wrong')
      console.log("error: ", error)
    }
  }

  const adminDeleteProfle = async (profileAddress, profileId) => {

    try {

        const adminAddress = "0x07792a0a4146a143a741ac5e5638d5ab8bc1f66d";

        if(userAccount.address === adminAddress) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Abi, signer);
      
            const profileTX = await contract.deleteProfle(profileAddress)
    
            const txHash = await provider.getTransaction(profileTX.hash);

          
            if(txHash) setLoaderState(true);
    
            await profileTX.wait()
    
            const txReceipt = await provider.getTransactionReceipt(profileTX.hash);

      
            setProfiles(profiles.filter((profile) => profile.profileId !== profileId));
          
    
            setLoaderState(false);
    
            if (txReceipt && txReceipt.blockNumber) {
              toast.success('Profile Deleted')
            } else {
              toast.error('Something went wrong')
            }
          
       
        } else{
          toast.error("Ole you are not the admin, Go and give your live to Christ...")
        }
      
    } catch (error) {
      setLoaderState(false);
      toast.error('Something went wrong')
      console.log("error: ", error)
    }
  }


  const init = async () => {

    const profilesArray = [];
  
    if(window.web3 || window.ethereum) {
  
      const connectHandler = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
     
        provider.on("network", (newNetwork, oldNetwork) => {
            if (oldNetwork) {
                window.location.reload();
            }
        });
  
        const {chainId} = await provider.getNetwork()
        const accounts = await provider.listAccounts() 
          if(accounts.length) {
    
            if(Number(chainId) === 4) {
              const balance = await provider.getBalance(accounts[0]);
              setUserAccount({
                address: accounts[0],
                balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
              })
              setWrongNetworkNotice(false)
            } else {
              setUserAccount({
                address: null,
                balance: null
              })
              setWrongNetworkNotice(true)
              toast.error('You are connected to the wrong network, please switch to Rinkeby Network')
              console.log("handleChainChanged")
            }
          }
      }
  
      const handleChainChanged = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
     
        provider.on("network", (newNetwork, oldNetwork) => {
            if (oldNetwork) {
                window.location.reload();
            }
        });
  
        const {chainId} = await provider.getNetwork()
        const accounts = await provider.listAccounts() 
          if(accounts.length) {
    
            if(Number(chainId) === 4) {
              const balance = await provider.getBalance(accounts[0]);
              setUserAccount({
                address: accounts[0],
                balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
              })
              setWrongNetworkNotice(false)
            } else {
              setUserAccount({
                address: null,
                balance: null
              })
              setWrongNetworkNotice(true)
              toast.error('You are connected to the wrong network, please switch to Rinkeby Network')
              console.log("handleChainChanged")
            }
          }
      }
  
      const handleAccountsChanged = async (accounts) => {
  
        if(accounts.length) {
  
          if(chainId && chainId === 4) {
            const balance = await provider.getBalance(accounts[0]);
            setUserAccount({
              address: accounts[0],
              balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
            })
            setWrongNetworkNotice(false)
          } else {
            setUserAccount({
              address: null,
              balance: null
            })
            setWrongNetworkNotice(true)
            toast.error('You are connected to the wrong network, please switch to Rinkeby Network')
            console.log("handleAccountsChanged")
          } 
          
        } else {
          setUserAccount({
            address: null,
            balance: null
          })
          setWrongNetworkNotice(false)
        }
      }
      window.ethereum.on('connect', connectHandler)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
  
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
     
      provider.on("network", (newNetwork, oldNetwork) => {
          if (oldNetwork) {
              window.location.reload();
          }
      });
      const {chainId} = await provider.getNetwork()
      if(chainId === 4) { //on Rinkeby, the provider can be used
  
        const contract = new ethers.Contract(contractAddress, Abi, provider);
        const allProfiles = await contract.queryFilter("NewProfile", 9407535); 
  
        allProfiles.forEach(profile => {
          const profileObj = {
            profileAddress: profile.args.from,
            firstName: profile.args.firstname,
            lastName: profile.args.lastname,
            profileId: Number(profile.args.userId)
          }
          profilesArray.unshift(profileObj)
        })
  
        contract.on('NewProfile', (lastName, firstName, from, userId, event) => {
          event.removeListener(); // for some reasons, this event is getting fired twice at every point a profile is created. removeListener prevents that
          const newProfile = {
            profileAddress: from,
            firstName,
            lastName,
            profileId: Number(userId)
          }
  
          setProfiles(prev => [newProfile, ...prev])
        })
  
      } else {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Abi, provider);
      
       
        
        const allProfiles = await contract.queryFilter("NewProfile", 9407535);
  
        allProfiles.forEach(profile => {
          const profileObj = {
            profileAddress: profile.args.from,
            firstName: profile.args.firstname,
            lastName: profile.args.lastname,
            profileId: Number(profile.args.userId)
          }
          profilesArray.unshift(profileObj)
        })
  
        contract.on('NewProfile', (lastName, firstName, from, userId, event) => {
          event.removeListener();
          const newProfile = {
            profileAddress: from,
            firstName,
            lastName,
            profileId: Number(userId)
          }
  
          setProfiles(prev => [newProfile, ...prev])
        })
      }
      
  
    } else {
      const contract = new ethers.Contract(contractAddress, Abi);
      console.log(contract)
  
      const allProfiles = await contract.queryFilter("NewProfile", 9407535);
  
      allProfiles.forEach(profile => {
        const profileObj = {
          profileAddress: profile.args.from,
          firstName: profile.args.firstname,
          lastName: profile.args.lastname,
          profileId: Number(profile.args.userId)
        }
        profilesArray.unshift(profileObj)
      })
  
      contract.on('NewProfile', (lastName, firstName, from, userId, event) => {
        event.removeListener();
        const newProfile = {
          profileAddress: from,
          firstName,
          lastName,
          profileId: Number(userId)
        }
  
        setProfiles(prev => [newProfile, ...prev])
      })
    }
  
    setProfiles(profilesArray);
  
  
  }

  useEffect(() => {

    

    init();

    
  }, [])


  return (
    <div className="App">
     <Header userAccount = {userAccount}  connectWallet = {connectWallet} />
     <div className="container mt-5">
      <div className="row">
        <div className="col-md-5 mt-5 mb-n3">
          <Profile newProfileData = {newProfileData} createProfile = {createProfile} onNamesChange = {onNamesChange} connected = {!!userAccount.address} loaderState = {loaderState} connectWallet = {connectWallet} />
        </div>
        <div className="col-md-7">
        <div  className="text-center">
                <h3 style={{color:'wheat'}}>Profile List</h3>
        </div>
        <div className="scroll " id="style-1">
          <Main profiles = {profiles} delteMyProfile={delteMyProfile} adminDeleteProfle={adminDeleteProfle} />

        </div>
        </div>
      </div>
     </div>
    </div>
  );
}

export default App;
