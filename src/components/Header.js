import React from 'react'

const Header = ({userAccount, connectWallet}) => {
    return (
        <nav style={{ paddingLeft: '50px', paddingRight: '50px'}} className="navbar navbar-expand-lg navbar-light bg-light">
        <a style={{fontWeight:'bold'}} className="navbar-brand" href="#">Test</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
                
            </ul>
            <span className="navbar-text">
                {userAccount.address ? <div className="d-flex w-100 justify-content-between">
                        <div className="mr-5">
                            <p style={{marginBottom: 0}}>Wallet</p>
                            <span className = "balance">{userAccount.balance} ETH</span>
                        </div>
                        
                        <div>
                            <p style={{marginBottom: 0}}>Address</p>
                            <span className = "address">{`${userAccount.address.substr(0, 6)}...${userAccount.address.substr(userAccount.address.length-4, userAccount.address.length)}`}</span>
                        </div>
                     
                    
                </div> : <button className="btn btn-primary" onClick = {connectWallet} >Connect</button>}
            </span>
        </div>
        </nav>
        
    )
}

export default Header
