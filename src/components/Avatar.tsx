import React from 'react';

type AvatarProps = {
    size: number;
    src: string;
};

const Avatar: React.FC<AvatarProps> = ({ size, src }) => {
    const width = size;
    const height = Math.floor(size * 1.15);

    const clipPath = `
    polygon(
      50% 0%,
      100% 25%,
      100% 75%,
      50% 100%,
      0% 75%,
      0% 25%
    )
  `;

    // Adjust the border width as needed
    const borderWidth = 4; // for example, a 4px border

    return (
        <div
            className="inline-flex justify-center items-center"
            style={{
                width: `${width + borderWidth * 2}px`, // Include the border in the width
                height: `${height + borderWidth * 2}px`, // Include the border in the height
                backgroundColor: 'white', // This creates the white border effect
                clipPath: clipPath,
                WebkitClipPath: clipPath,
                borderRadius: '0%', // Adjust as needed for the desired rounded corners
                display: 'flex', // Ensures that the child div is centered
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', // Ensure the image is centered within the clip-path
                    clipPath: clipPath,
                    WebkitClipPath: clipPath,
                }}
            />
        </div>
    );
};

export default Avatar;