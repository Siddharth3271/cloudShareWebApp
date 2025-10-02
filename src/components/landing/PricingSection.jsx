import React from 'react'

const PricingSection = ({pricingPlans}) => {
  return (
   <div className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
          Simple Transparent Pricing
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Choose the plan that belongs best for you
        </p>
      </div>
      <div className='mt-16 space-y-12 lg:space-y-0 lg:grid-cols-3 lg:gap-8'>
            {pricingPlans.map((plan,index)=>{
              <div key={index} className={`flex flex-col rounded-lg shadow-lg overflow-hidden`}>

              </div>
            })}
      </div>
    </div>
   </div>
  )
}

export default PricingSection
