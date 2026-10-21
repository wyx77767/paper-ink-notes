import type { ReactNode, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  children?: ReactNode;
}

function Icon({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16.5 16.5 4.5 4.5" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const TrashIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" />
  </Icon>
);

export const BoldIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 4.5h5.5a3.75 3.75 0 0 1 0 7.5H7zM7 12h6a4 4 0 0 1 0 8H7z" />
  </Icon>
);

export const ItalicIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 4h8M6 20h8M14 4l-4 16" />
  </Icon>
);

export const HeadingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 5v14M18 5v14M6 12h12" />
  </Icon>
);

export const QuoteIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9.5 7H5v6h4.5v4H5M19 7h-4.5v6H19v4h-4.5" />
  </Icon>
);

export const ListIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.6} />
  </Icon>
);

export const LinkIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 13.5a4 4 0 0 0 5.66 0l2.84-2.84a4 4 0 0 0-5.66-5.66l-1.4 1.4" />
    <path d="M14 10.5a4 4 0 0 0-5.66 0L5.5 13.34a4 4 0 0 0 5.66 5.66l1.4-1.4" />
  </Icon>
);

export const CodeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.5 5l-3 14" />
  </Icon>
);

export const CopyIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H6a2 2 0 0 0-2 2v7.5A1.5 1.5 0 0 0 5.5 15" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m4.5 12.5 5 5L20 6.5" />
  </Icon>
);

export const FileTextIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V9z" />
    <path d="M13 3v6h6M8.5 13h7M8.5 17h5" />
  </Icon>
);

export const EyeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Icon>
);

export const PencilIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 20h4L20 8l-4-4L4 16v4Z" />
    <path d="m14 6 4 4" />
  </Icon>
);

export const CloudCheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 18.5a4.5 4.5 0 0 1-.4-9A5.5 5.5 0 0 1 17 8.7a4 4 0 0 1 .6 8" />
    <path d="m9 14 2 2 4-4" />
  </Icon>
);
