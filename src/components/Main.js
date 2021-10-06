import React from 'react'
import Profile from "../components/Profiles"

const Main = ({profiles, delteMyProfile, adminDeleteProfle}) => {
    return (
        <div className="row">
            
            
        <div className="col-md-12">
        {profiles.length !==0 && profiles.map((profile, index) => {
                    return <Profile key = {index} profileInfo = {profile} delteMyProfile={delteMyProfile} adminDeleteProfle={adminDeleteProfle} />
                })}
        </div>
      </div>
    )
}

export default Main
