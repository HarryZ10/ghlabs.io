import React from "react";
import Image from "next/image";
type Shape = "square" | "circle";

interface CustomIconProps {
  shape: Shape;
  link: string;
  imagePath: string;
  size: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  shape,
  link,
  imagePath,
  size,
}) => {
  const iconStyle = {
    display: "inline-block",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: shape === "circle" ? "50%" : "0",
    overflow: "hidden",
  };

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" style={iconStyle}>
      <Image
        src={imagePath}
        alt="Custom Icon"
        fill
        style={{ objectFit: "cover", width: '100%', height: '100%' }}
      />
    </a>
  );
};

export default CustomIcon;
