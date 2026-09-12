import InfoPage from '@/components/storefront/InfoPage';
import RitualFinder from '@/components/storefront/RitualFinder';
export const metadata={title:'Find your wellness ritual',description:'Discover a botanical ritual for your evening, skin or space, and save it for your next visit.',alternates:{canonical:'/ritual-finder'}};
export default function Page(){return <InfoPage eyebrow="MAKE IT PERSONAL" title="Your moment starts here." intro="A little intention. A ritual that feels like you."><RitualFinder/></InfoPage>}
