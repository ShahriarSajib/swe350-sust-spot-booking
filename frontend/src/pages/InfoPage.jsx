import React from 'react';
import { useParams} from 'react-router-dom';

const InfoPage = () => {
  const { type } = useParams();

  const content = {
    guidelines: {
      title: "Booking Guidelines",
      lastUpdated: "May 2026",
      sections: [
        { h: "1. Eligibility", p: "Only registered students and faculty of SUST with a valid ID can book spots." },
        { h: "2. Booking Timeframe", p: "Requests must be submitted at least 48 hours before the event start time." },
        { h: "3. Responsibility", p: "Organizers are responsible for maintaining cleanliness and campus property safety." }
      ]
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "May 2026",
      sections: [
        { h: "1. Acceptance", p: "By using SUST Spot Booking, you agree to follow all university regulations." },
        { h: "2. Cancellations", p: "Admin reserves the right to cancel any booking due to university emergencies." },
        { h: "3. Misuse", p: "Providing false information during booking will lead to account suspension." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "May 2026",
      sections: [
        { h: "1. Data Collection", p: "We collect your name, registration number, and email for authentication purposes." },
        { h: "2. Data Usage", p: "Your data is only used to manage bookings and send automated notifications." },
        { h: "3. Security", p: "We use industry-standard encryption to protect your personal information." }
      ]
    }
  };

  const pageData = content[type];

  if (!pageData) {
    return <div className="py-20 text-center">Page not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 md:p-12">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageData.title}</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: {pageData.lastUpdated}</p>
        
        <div className="space-y-8">
          {pageData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-sky-700 mb-3">{section.h}</h2>
              <p className="text-gray-700 leading-relaxed">{section.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;