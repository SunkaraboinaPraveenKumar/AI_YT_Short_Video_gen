"use client";
import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthContext } from '@/app/provider';

function Billing() {
    const {user, setUser}=useAuthContext();
  const plans = [
    { id: 1, name: "Basic", price: 100, credits: 10 },
    { id: 2, name: "Standard", price: 1000, credits: 50 },
    { id: 3, name: "Premium", price: 10000, credits: 100 },
  ];

  const updateUserCredits=useMutation(api.users.UpdateUserCredits);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const onPaymentSuccess=async(price, credits)=>{
    // update user credits.
    const result = await updateUserCredits({
        uid: user?._id,
        credits: Number(user?.credits)+Number(credits)
    })

    setUser(prev=>({
        ...prev,
        credits:Number(user?.credits)+Number(credits)
    }))
    toast('Credits Added Successfully');
  }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg shadow-md p-6 transition transform hover:scale-105 
                        ${selectedPlan?.id === plan.id ? 'border-blue-500' : 'border-gray-200'}`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">{plan.name} Plan</h2>
            <div className="mb-4">
              <p className="text-xl font-bold text-white">₹{plan.price}</p>
              <p className="text-sm text-white">{plan.credits} Credits</p>
            </div>
            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-2 px-4 rounded 
                          ${selectedPlan?.id === plan.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
            </button>
            {selectedPlan?.id === plan.id && (
              <div className="mt-4">
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
                  onApprove={()=>onPaymentSuccess(plan?.price, plan?.credits)}
                  onCancel={()=>toast("Order Cancelled!!")}
                  createOrder={(data,action)=>{
                    return action?.order?.create({
                        purchase_units:[
                            {
                                amount:{
                                    value:plan?.price,
                                    currency_code:'USD'
                                }
                            }
                        ]
                    })
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Billing;
