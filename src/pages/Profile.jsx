import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {useNavigate, Link} from 'react-router-dom'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile () {
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const[formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const [loading, setLoading]= useState(true)
    const [listings, setListings] = useState(null)
    const {name, email} = formData
    const [listingsUpdated, setListingsUpdated] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, 
                where('userRef', '==', auth.currentUser.uid), 
                orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            let listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
        fetchUserListings()
    }, [auth.currentUser.uid, listingsUpdated])

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

    const onDelete = async (listingId, listingName) => {
        if(window.confirm(`Are you sure you want to delete the listing "${listingName}"?`)) {
            await deleteDoc(doc(db, 'listings', listingId))
            setListingsUpdated(!listingsUpdated)
            toast.success(`Listing "${listingName}" has been deleted.`)
        }
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

                {!loading && listings?.length > 0 && (
                    <>
                    <p className="listingText">Your Listings</p>
                    <ul className="listingsList">
                        {listings.map((listing) => (
                            <ListingItem 
                            key={listing.id}
                            listing={listing.data}
                            id={listing.id} 
                            onDelete={()=> onDelete(listing.id, listing.data.name)}
                            />
                            
                        ))}
                    </ul>
                    </>
                )}
            </main>
        </div>
}

export default Profile