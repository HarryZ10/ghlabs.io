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

    const borderWidth = 4;

    return (
        <div
            className="inline-flex justify-center items-center"
            style={{
                width: `${width + borderWidth * 2}px`,
                height: `${height + borderWidth * 2}px`,
                backgroundColor: 'white',
                clipPath: clipPath,
                WebkitClipPath: clipPath,
                borderRadius: '0%',
                display: 'flex',
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
                    backgroundPosition: 'center',
                    clipPath: clipPath,
                    WebkitClipPath: clipPath,
                }}
            />
        </div>
    );
};

export default Avatar;