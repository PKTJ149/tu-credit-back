import { registrationStatusInfo, type RegistrationStatus } from "@/lib/learning/registration-status";

type RegistrationStatusBadgeProps = {
  status: RegistrationStatus;
};

export function RegistrationStatusBadge({ status }: RegistrationStatusBadgeProps) {
  const info = registrationStatusInfo[status];

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${info.badgeBg} ${info.badgeText}`}
    >
      {info.label}
    </span>
  );
}
