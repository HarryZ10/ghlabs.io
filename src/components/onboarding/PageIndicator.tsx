import React from 'react';

interface PageIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-12 h-2 rounded-full ${index === currentStep ? 'bg-gh_green-500' : 'bg-gray-300'
                        }`}
                />
            ))}
        </div>
    );
};

export default PageIndicator;
