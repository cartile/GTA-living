import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {useNavigate, Link} from 'react-router-dom'
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile () {
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const[formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    const {name, email} = formData
    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try{
            if(auth.currentUser.displayName !== name) {
                //updates display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
                //update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name,
                })
            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    return <div className='profile'>
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type='button' className="logOut" onClick={onLogout}> 
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>
                        {changeDetails ? 'Confirm Details' : 'Edit Details'}
                    </p>
                    
                </div>
                <div className="profileCard">
                    <form>
                        <input type="text" 
                        id="name" 
                        className={!changeDetails ? 'profileName' :
                        'profileNameActive'} 
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                        />  
                        <input type="text" 
                        id="email" 
                        className={!changeDetails ? 'profileEmail' :
                        'profileEmailActive'} 
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                        />  

                    </form>

                </div>
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt="home" />
                    <p>Sell or Rent your home</p>
                    <img src={arrowRight} alt="arrowRight" />
                </Link>
            </main>
        </div>
}

export default Profile