import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export default function Card({
  title,
  subtitle,
  children,
  className = "",
  actions,
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-700 bg-slate-800 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
