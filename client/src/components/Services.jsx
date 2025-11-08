import React from 'react'
import Card from './Card'
import { NavLink } from 'react-router-dom'

function Services() {
  const services = [
    {
      imgsrc: "https://www.mypunepulse.com/wp-content/uploads/2025/09/Legal-Implications-of-Not-Paying-Traffic-Challan-on-Time-and-How-to-Pay-It-Online-1024x576.jpg",
      title: "E-Challans",
      description: "Users can seamlessly view their Challans for the registered vehicles without checking the slow government websites. It works with just an API call from third-party websites. This feature is yet to be implemented.",
      link: "https://echallan.parivahan.gov.in/index/accused-challan"
    },
    {
      imgsrc: "https://badger-website-staging.s3.amazonaws.com/public/images/core/apple-maps-gps.png",
      title: "Navigate",
      description: "Users can navigate to their preferred destinations with the maps feature. It is integrated with Google Maps. The trips are recorded and stored. Users can have a record of the list of past trips.",
      link: "/nav-maps"
    },
    {
      imgsrc: "https://i.pcmag.com/imagery/roundups/04LpAdc1pBMYF71CqYY607x-2..v1706284572.png",
      title: "Your Trips",
      description: "The trips that you searched for all stored in one place so that you don't need to search through once again. A single click and its all available here.",
      link: "/trips"
    },
    {
      imgsrc: "https://www.reliancegeneral.co.in/SiteAssets/RgiclAssets/images/blogs-images/blogImg07.webp",
      title: "Vehicle Documents",
      description: "Keep your RC book, insurance, and service papers organized. Access them instantly whenever you need — safe, digital, and hassle-free. All your vehicle papers — organized, secure, and just a click away.",
      link: "/docs"
    },
    {
      imgsrc: "https://blogs.gomechanic.com/wp-content/uploads/2020/07/Car-Dashcam.jpeg",
      title: "Safety",
      description: "You can drive safely with our indigenous driver drowsiness detection and seat belt detection. Now you can ensure safety throughout the trip. Your safety our responsibility.",
      link: "/safety"
    }
  ];

  return (
    <div className='min-h-screen w-full bg-gray-900 py-16 px-4' id='services'>
      <h1 className='text-white text-4xl sm:text-5xl lg:text-6xl p-3 text-center font-light mb-12'>
        Our Comprehensive Services
      </h1>
      <div className='card-div flex flex-wrap justify-center w-full gap-6 max-w-7xl mx-auto'>
        {services.map((service, index) => (
          <Card 
            key={index}
            imgsrc={service.imgsrc}
            title={service.title}
            description={service.description}
            link={service.link}
          />
        ))}
      </div>
    </div>
  )
}

export default Services