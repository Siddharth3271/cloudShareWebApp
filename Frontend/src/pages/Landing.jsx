import { useNavigate } from "react-router-dom";
import { features, pricingPlans, testimonials } from "../assets/data";
import CTASection from "../components/landing/CTASection";
import FeatureSection from "../components/landing/FeatureSection";
import FooterSection from "../components/landing/FooterSection";
import HeroSection from "../components/landing/HeroSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialSection from "../components/landing/TestimonialSection";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";


const Landing=()=>{
    const {openSignIn,openSignUp} = useClerk();
    const {isSignedIn}=useUser();
    const navigate=useNavigate();

    useEffect(()=>{
        if(isSignedIn){
            navigate("/dashboard")
        }
    },[isSignedIn,navigate])

    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp}/>

            {/* Features Section */}
            <FeatureSection features={features}/>

            {/* Pricing Section */}
            <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>

            {/* Testimonials Section */}
            <TestimonialSection testimonials={testimonials}/>

            {/* CTA Section */}
            <CTASection openSignUp={openSignUp}/>

            {/* Footer Section */}
            <FooterSection/>
        </div>
    )
}

export default Landing;