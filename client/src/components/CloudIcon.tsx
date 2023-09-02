import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";

const CloudIcon: React.FC = () => {
  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'cloud-icon'
    },
    url: {
      secureDistribution: 'www.example.com',
      secure: true
    }
  });

  // Create a CloudinaryImage with the configuration set.
  const myImage: CloudinaryImage = cld.image('sample');

  // Render the image in a React component.
  return (
    <div>
      <AdvancedImage cldImg={myImage} />
    </div>
  );
};

export default CloudIcon;
