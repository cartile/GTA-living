import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import Spinner from '../components/Spinner'
import {db} from '../firebase.config'
import shareIcon from '../assets/svg/shareIcon.svg'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import SwiperCore, {Autoplay, Pagination, Scrollbar, A11y, FreeMode, Navigation, Thumbs} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css'
SwiperCore.use([Autoplay, Navigation, Pagination, Scrollbar, A11y])

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
      <Swiper 
        style={{ width: '100%', height: '500px', 
        "--swiper-navigation-color": "#fff",
        "--swiper-pagination-color": "#fff",}} 
        slidesPerView={1} 
        pagination={{ clickable: true,
                     }}
        modules={[FreeMode, Navigation, Thumbs]}
        spaceBetween={10}
        navigation={false}
        className='mySwiper2'
                     >
            {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
                <div
                style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: 'contain',
                }}
                className='swiperSlideDiv'
                />
            </SwiperSlide>
        ))}
      </Swiper>
     
    
      
      {/* <button onClick={toggleAutoscroll}>
        {autoscrollEnabled ? 'Disable Autoscroll' : 'Enable Autoscroll'}
      </button> */}

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
                    ${(listing.regularPrice - listing.discountedPrice)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    } discount!
                </p>
            )}
            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1 
                    ? `${listing.bedrooms} Bedrooms`
                    : '1 Bedroom' }
                </li>
                <li>
                    {listing.bathrooms > 1 
                    ? `${listing.bathrooms} Bathrooms`
                    : '1 Bathroom' }
                </li>
                <li>{listing.parking && 'Parking Available'}</li>
                <li>{listing.furnished && 'Furnished'}</li>
            </ul>

            <p className="listingLocationTitle">Location:</p>


            <div className="leafletContainer">
                <MapContainer style= {{height: '100%', width: '100%'}}
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13} scrollWheelZoom={false}
                >
                <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                />
                <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                    <Popup>{listing.location}</Popup>
                </Marker>

                </MapContainer>
            </div>
            {auth.currentUser?.uid !== listing.userRef && (
                <Link 
                to={`/contact/${listing.userRef}?listingName=${listing.name}`} 
                className='primaryButton'>
                    Contact Landlord
                </Link>
            )}
        </div>
   </main>
    )
}

export default Listing