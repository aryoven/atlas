import { ReactNode } from "react";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";
import DashboardSignOut from "@/components/dashboard/DashboardSignOut";

type DashboardHeaderProps = {
  actions?: ReactNode;
};

export default function DashboardHeader({ actions }: DashboardHeaderProps) {
  return (
    <header className="border-b border-white/10">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3">
            {actions}
            <DashboardSignOut />
          </div>
        </div>
      </Container>
    </header>
  );
}
