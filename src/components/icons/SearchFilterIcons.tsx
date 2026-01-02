import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function FilterIcon({ size = 22, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size + 1}
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M21.8952 0.546667C21.8102 0.382828 21.682 0.245316 21.5246 0.148975C21.3672 0.0526333 21.1864 0.0011216 21.0018 0H1.00183C0.817255 0.0011216 0.636496 0.0526333 0.47906 0.148975C0.321624 0.245316 0.193491 0.382828 0.108493 0.546667C0.0236485 0.710978 -0.0126327 0.896058 0.00389658 1.08024C0.0204258 1.26442 0.0890817 1.44009 0.201827 1.58667L7.33516 11.3333V21.6667C7.33861 21.9308 7.44508 22.1832 7.63187 22.37C7.81867 22.5567 8.07102 22.6632 8.33516 22.6667H13.6685C13.9326 22.6632 14.185 22.5567 14.3718 22.37C14.5586 22.1832 14.665 21.9308 14.6685 21.6667V11.3333L21.8018 1.58667C21.9146 1.44009 21.9832 1.26442 21.9998 1.08024C22.0163 0.896058 21.98 0.710978 21.8952 0.546667Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SearchIcon({ size = 21, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.2929 20.2071C19.6834 20.5976 20.3166 20.5976 20.7071 20.2071C21.0976 19.8166 21.0976 19.1834 20.7071 18.7929L19.2929 20.2071ZM14.2929 15.2071L19.2929 20.2071L20.7071 18.7929L15.7071 13.7929L14.2929 15.2071Z"
        fill="currentColor"
      />
    </svg>
  );
}
