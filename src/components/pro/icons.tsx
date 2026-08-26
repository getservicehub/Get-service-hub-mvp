import type { SVGProps, ReactNode } from "react";

type IconName = "scale" | "building" | "sofa" | "pen-tool" | "calculator" | "camera" | "key"
  | "shield-check" | "message-circle" | "lock" | "clock" | "arrow-right" | "search" | "map-pin" | "menu" | "x";

function Base(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  const { children, ...rest } = props;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...rest}>{children}</svg>;
}

export function ProIcon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  switch (name) {
    case "scale": return <Base {...props}><path d="M12 3v18M5 8l-3 6a3.5 3.5 0 007 0l-3-6zM19 8l-3 6a3.5 3.5 0 007 0l-3-6zM5 8h14M9 5h6" /></Base>;
    case "building": return <Base {...props}><path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-5h6v5" /></Base>;
    case "sofa": return <Base {...props}><rect x="3" y="11" width="18" height="8" rx="1" /><path d="M7 11V8a2 2 0 012-2h6a2 2 0 012 2v3" /><path d="M3 19v2M21 19v2" /></Base>;
    case "pen-tool": return <Base {...props}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></Base>;
    case "calculator": return <Base {...props}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h8M8 11h2m3 0h2M8 15h2m3 0h2" /></Base>;
    case "camera": return <Base {...props}><rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6l1.5-2h5L16 6" /></Base>;
    case "key": return <Base {...props}><circle cx="8" cy="15" r="4" /><path d="M10.5 12.5L20 3M17 6l2 2M14 9l2 2" /></Base>;
    case "shield-check": return <Base {...props}><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></Base>;
    case "message-circle": return <Base {...props}><path d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.4 0-2.7-.3-3.9-.9L3 20l1-5.6A8.5 8.5 0 1121 11.5z" /></Base>;
    case "lock": return <Base {...props}><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M8 10V7a4 4 0 018 0v3" /></Base>;
    case "clock": return <Base {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" /></Base>;
    case "arrow-right": return <Base {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
    case "search": return <Base {...props}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></Base>;
    case "map-pin": return <Base {...props}><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></Base>;
    case "menu": return <Base {...props}><path d="M3 6h18M3 12h18M3 18h18" /></Base>;
    case "x": return <Base {...props}><path d="M18 6L6 18M6 6l12 12" /></Base>;
    default: return null;
  }
}
