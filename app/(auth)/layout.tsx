
import RouteGuard from "@/components/RouteGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard mode="guest">
      {children}
    </RouteGuard>
  );
}
