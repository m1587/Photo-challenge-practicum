interface LogoGraphicProps {
  style?: React.CSSProperties
}

export default function LogoGraphic({ style }: LogoGraphicProps) {
  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <text x="20" y="55" fontFamily="Arial, sans-serif" fontSize="50" fill="#d4a574">
        S
      </text>
      <circle cx="80" cy="50" r="20" fill="#C4A36D" />
      <circle cx="80" cy="50" r="15" fill="#1a1a1a" />
      <rect x="100" y="25" width="15" height="7" rx="2" fill="#C4A36D" />
    </svg>
  )
}
