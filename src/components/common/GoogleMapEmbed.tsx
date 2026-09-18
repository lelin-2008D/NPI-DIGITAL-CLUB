import React from 'react';

interface GoogleMapEmbedProps {
  className?: string;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({ className = '' }) => {
  return (
    <div className={`map-wrapper luxury-map ${className}`}>
      <iframe
        title="Nepal Polytechnic Institute (NPI) Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.776606886364!2d84.43588997611846!3d27.693297626117366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb2d7749f7e3%3A0x6fb32488a07f0bb8!2sNepal%20Polytechnic%20Institute!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};
