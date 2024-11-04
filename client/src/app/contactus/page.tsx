'use client'
import Contact from '@/components/contact-page-components/contactus'
import React from 'react'
import { useEffect,useState } from 'react'
import Navbar from '@/components/navbar'
import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, FacebookIcon, LinkedinIcon, TwitterIcon , } from 'lucide-react';
import ContactComp from '@/components/contact-page-components/contactComp'

const ContactPage = () => {
  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [])

  const [isMapLoaded, setIsMapLoaded] = useState(false); // State to track map loading

  useEffect(() => {
    // Simulate map loading time (you can adjust this delay)
    const timeout = setTimeout(() => setIsMapLoaded(true), 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    <div className='overflow-x-hidden'>
    {/* <div className="fixed w-full" style={{ zIndex: "999" }}>
      <Navbar/>
          
      </div>  */}
    <div className="bg-DB w-full min-h-full ">
      <Contact/>
    </div>


    <div className='p-5 px-8 flex flex-col lg:flex-row justify-between items-center bg-LG'>
      <div className='flex flex-col gap-9'>
        <div className='w-[520px]'>
          <h1 className='text-[30px] leading-[36px] font-[500] mb-2 -mt-0 md:-mt-32'>Have questions or need assistance? <span className='text-[#5C7226]'>Fill out the form,</span> and our team will get back to you shortly. You can also contact us by phone or email for faster service.</h1>
          
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
            <div>
              <h1 className='font-semibold mb-2'>Call Center</h1>
              <p>+92 304-1115566</p>
              <p>+92 42 3585 6772-5</p>
            </div>

            <div>
              <h1 className='font-semibold mb-2'>Our Location</h1>
              <p>USA New York 123 San Fran America</p>
            </div>

            <div>
              <h1 className='font-semibold mb-2'>Email</h1>
              <p>info@solveagripak.com</p>
            </div>

            <div>
              <h1 className='font-semibold mb-2'>Social Media</h1>
              <div className='flex items-center gap-5 '>
                  <FacebookIcon className='bg-[#A8CF45] rounded-full p-1' size={30}/>
                  <TwitterIcon className='bg-[#A8CF45] rounded-full p-1' size={30}/>
                  <LinkedinIcon className='bg-[#A8CF45] rounded-full p-1' size={30}/>
              </div>
            </div>
          </div>
      </div>
      <div>

      </div>
      <div className='w-[100%] block lg:p-0'>
      <ContactComp/>
      </div>
    </div>

    <div className="flex justify-center px-[24px] py-[24px] w-full lg:w-screen h-[682px]  lg:px-[80px] lg:py-[40px]">
        <div className="relative w-full lg:w-[98%] lg:mx-6 md:h-96 lg:h-[550px] rounded-xl overflow-hidden">
          {/* Conditional rendering to show Skeleton while map is loading */}
          {!isMapLoaded ? (
            <Skeleton className="absolute inset-0 w-full h-full rounded-3xl" />
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.7605317111897!2d74.33999707506752!3d31.475772949345114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919042715f767ad%3A0xb0251034ce47145e!2sARFA%20Tower%2C%20Lahore%20%E2%80%93%20Kasur%20Rd%2C%20Nishtar%20Town%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1725144937661!5m2!1sen!2s"
              className="absolute inset-0 w-full h-full"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}

          {/* Button placed over the map */}
          <a
            href="https://goo.gl/maps/dLKU1RY6KbvNkZw68"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 lg:left-14 left-5 px-2 lg:px-6 py-2 bg-[#16339C] text-white  hover:bg-blue-500 transition-all text-[14px] font-semibold"
          >
            View in Google Maps
          </a>
        </div>
      </div>
      </div>
    </>
  )
}

export default ContactPage;
