import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'


function Profile () {
    useEffect(() => {
        console.log(auth.currentUser)
    }, []) 

    return (
        <div>
            <h1>Profile</h1>

        </div>
    )
}

export default Profile