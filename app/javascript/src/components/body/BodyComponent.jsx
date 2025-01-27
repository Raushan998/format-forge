import  React from 'react';

const BodyComponent = ({ children })=>{
    return (
        <div className="container mx-auto px-4 mt-32">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default BodyComponent;