import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AfterHero from './AfterHero';

function LandingPage() {
    return (
        <>
         <header>
            <Navbar/>
         </header>

         <main>
          <section>
            <Hero/>
            </section>   
 
            <section>
              <AfterHero/> 
            </section>
           
        </main> 
        </>
       
    );
}

export default LandingPage;