import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import Spinner from '../components/Spinner'
import {db} from '../firebase.config'
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () =>{
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [navigate, params.listingId])
    
    if(loading) {
        return <Spinner />
    }

    return (
   <main>
    {/*slideshow */}
        <div className="shareIconDiv" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(()=>{ //prevents spamming
                setShareLinkCopied(false)
            }, 2000)
        }}>

            <img src={shareIcon} alt=""/>
        </div>
            {shareLinkCopied && <p className='linkCopied'>Listing Link Copied!</p>}

        <div className='listingDetails'>
            <p className='listingName'>
                {listing.name} - $
                {listing.offer ? (
                    <>
                    <del>
                        {listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </del>
                    {' '}
                    ${listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </>
                ) : (
                    listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                )}
            </p>

            <p className='listingLocation'>
                {listing.location}
            </p>
            <p className='listingType'>
                For {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </p>
            {listing.offer && (
                <p className="discountPrice">
                    ${listing.regularPrice - listing.discountedPrice} discount!
                </p>
            )}
        </div>
   </main>
    )
}

export default Listing