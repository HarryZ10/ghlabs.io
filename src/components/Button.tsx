import { IconType } from "react-icons";

export interface ButtonProps {
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    outline?: boolean;
    altPurpose?: string;
    small?: boolean;
    icon?: IconType;
    iconPos?: 'left' | 'right'; // limit iconPos to 'left' or 'right'
    href?: string;
}

const Button: React.FC<ButtonProps> = ({
    label,
    className,
    onClick,
    disabled,
    outline,
    altPurpose,
    small,
    icon: Icon,
    iconPos = 'left', // default to left if no pos provided
    href,
}) => {
    const buttonContent = (
        <div className={`flex flex-row items-center gap-1 ${iconPos === 'right' ? 'flex-row-reverse' : ''}`}>
            {Icon && <Icon size={16} />}
            {label}
        </div>
    );

    if (altPurpose === undefined) {
        altPurpose = '';
    }

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block ${disabled ? 'pointer-events-none' : ''}`}
            >
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className={`
                        flex
                        flex-row
                        items-center
                        justify-center
                        relative
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        rounded-lg
                        hover:opacity-80
                        hover:shadow-md
                        transition
                        border
                        ${outline ? 'bg-opacity-0' : 'bg-gh_green-500'}
                        ${outline ? 'border-black' : 'bg-gh_green-500'}
                        ${outline ? 'text-black' : 'text-white'}
                        ${small ? 'text-xs' : 'text-sm'}
                        ${small ? 'py-2' : 'py-2'}
                        ${small ? 'px-2' : 'px-3'}
                        ${small ? 'w-1/2' : ''}
                        ${className}
                    `}
                >
                    {buttonContent}
                </button>
            </a>
        );
    } else if (altPurpose === 'contact') {
        return (
            <button
                disabled={disabled}
                onClick={onClick}
                className={`
                    flex
                    flex-row
                    items-center
                    justify-center
                    relative
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    rounded-lg
                    hover:opacity-80
                    hover:shadow-md
                    transition
                    border
                    text-black
                    ${outline ? 'bg-opacity-0' : 'bg-gray-200'}
                    ${outline ? 'border-black' : 'bg-gray-200'}
                    ${small ? 'text-xs' : 'text-sm'}
                    ${small ? 'py-2' : 'py-2'}
                    ${small ? 'px-2' : 'px-3'}
                    ${small ? 'w-1/2' : ''}
                    ${className}
                `}
            >
                {buttonContent}
            </button>
        )
    }

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
                flex
                flex-row
                items-center
                justify-center
                relative
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-lg
                hover:opacity-80
                hover:shadow-md
                transition
                border
                ${outline ? 'bg-opacity-0' : 'bg-gh_green-500'}
                ${outline ? 'border-black' : 'bg-gh_green-500'}
                ${outline ? 'text-black' : 'text-white'}
                ${small ? 'text-xs' : 'text-sm'}
                ${small ? 'py-2' : 'py-2'}
                ${small ? 'px-2' : 'px-3'}
                ${small ? 'w-1/2' : ''}
                ${className}
            `}
        >
            {buttonContent}
        </button>
    );
};

export default Button;
