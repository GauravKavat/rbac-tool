import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, Lock } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                RBAC Configuration Tool
              </Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex flex-col items-center text-center space-y-8 py-16">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                RBAC Configuration Tool
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Manage roles, permissions, and access control for your application with an intuitive interface
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="p-6 border rounded-lg space-y-3">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage individual permissions for your application
                </p>
              </div>
              <div className="p-6 border rounded-lg space-y-3">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Roles</h3>
                <p className="text-sm text-muted-foreground">
                  Define user roles and organize your access control structure
                </p>
              </div>
              <div className="p-6 border rounded-lg space-y-3">
                <Lock className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Access Control</h3>
                <p className="text-sm text-muted-foreground">
                  Assign permissions to roles and manage user access
                </p>
              </div>
            </div>

            {hasEnvVars ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Please configure your Supabase environment variables to get started
                </p>
                <Button disabled>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}