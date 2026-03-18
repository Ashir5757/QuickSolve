import React from 'react';

export default function OnboardingPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
                <p className="text-gray-600 mb-6">Get started by setting up your account.</p>
                
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                    Begin Setup
                </button>
            </div>
        </div>
    );
}