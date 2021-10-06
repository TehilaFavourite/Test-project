import React from 'react'
import { FaTimes } from 'react-icons/fa'

const Profiles = ({profileInfo: {profileAddress, profileId, firstName, lastName}, delteMyProfile, adminDeleteProfle}) => {
    return (
        
        <div style={{marginBottom: 10}} className="card ">
            <div className="card-header ">
                <div className="row" >
                    <div className="col-6 text-left">
                        <a href="#" onClick={() => adminDeleteProfle(profileAddress, profileId)} style={{margin: 5}} className="btn btn-secondary">Admin Delete</a>
                    </div>
                    <div className="col-6 text-right">
                        <a href="#" onClick={() => delteMyProfile(profileAddress, profileId)}  className="btn btn-primary">Delete</a>
                    </div>
                </div>
            </div>
          <div className="card-body">
            <div className="row">
                
                <div className="col-6">
                   <p className="font-weight-bold" style={{fontSize: 20}} >Profile Id: {profileId}</p>
                   <p className="font-weight-bold" style={{fontSize: 20}}>First name: {firstName}</p>
                </div>
                <div className="col-6">
                    <p className="font-weight-bold" style={{fontSize: 20}}>Address: {`${profileAddress.substr(0, 6)}...${profileAddress.substr(profileAddress.length-4, profileAddress.length)}`}</p>
                    <p className="font-weight-bold" style={{fontSize: 20}}>Last name: {lastName}</p>
                </div>
                
            </div>
          </div>
         
          </div>

       
    )
}

export default Profiles
