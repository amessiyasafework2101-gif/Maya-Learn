
import RouteGuard from "@/components/RouteGuard";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard mode="verification">
      {children}
    </RouteGuard>
  );
}
