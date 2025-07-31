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
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center px-0">
        <div className="flex w-full max-w-5xl mx-auto justify-between items-center p-3 px-5 text-sm">
          <Link href={"/"} className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5" />
            RBAC Configuration Tool
          </Link>
          <div className="flex items-center gap-2">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">RBAC Configuration Tool</h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Manage roles, permissions, and access control for your application with an intuitive interface
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
            <div className="p-5 border rounded-lg space-y-2">
              <Shield className="h-7 w-7 text-primary mx-auto" />
              <h3 className="font-semibold">Permissions</h3>
              <p className="text-xs text-muted-foreground">
                Create and manage individual permissions for your application
              </p>
            </div>
            <div className="p-5 border rounded-lg space-y-2">
              <Users className="h-7 w-7 text-primary mx-auto" />
              <h3 className="font-semibold">Roles</h3>
              <p className="text-xs text-muted-foreground">
                Define user roles and organize your access control structure
              </p>
            </div>
            <div className="p-5 border rounded-lg space-y-2">
              <Lock className="h-7 w-7 text-primary mx-auto" />
              <h3 className="font-semibold">Access Control</h3>
              <p className="text-xs text-muted-foreground">
                Assign permissions to roles and manage user access
              </p>
            </div>
          </div>
          {hasEnvVars ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-xs">
                Please configure your Supabase environment variables to get started
              </p>
              <Button disabled>Get Started</Button>
            </div>
          )}
        </div>
      </div>
      <footer className="w-full mt-auto flex items-center justify-center border-t mx-auto text-center text-xs py-6">
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
      </footer>
    </main>
  );
}