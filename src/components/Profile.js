import React from 'react'

const Profile = ({createProfile, onNamesChange, newProfileData, connected, loaderState, connectWallet}) => {

    const onClickButton = (e) => {
        e.preventDefault()
        if(connected) {
            createProfile()
        } else {
            connectWallet()
        }
    }

    return (
        <div className="row mt-5 mb-5">
          <div className="col-md-12">
          <div className="card ">
            <div className="card-header ">
               <h3>Create Profile</h3>
            </div>
            <div className="card-body">
            <form>
                <div className="form-group text-left">
                    <label className="text-left" >First name</label>
                    <input type="text" className="form-control" placeholder="First name" name="firstName" onChange = {onNamesChange} value = {newProfileData.firstName} />
                </div>
                <div className="form-group text-left">
                    <label className="" >Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" name = "lastName" onChange = {onNamesChange} value = {newProfileData.lastName} />
                </div>
                
                <button type="submit" className="btn btn-primary" onClick={onClickButton}>{!connected ? "Please connect wallet" : "Create Profile" }</button>
            </form>
            </div>
           
            </div>
          </div>
        </div>
    )
}

export default Profile
