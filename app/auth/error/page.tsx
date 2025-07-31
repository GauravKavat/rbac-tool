import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-0">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-center mb-12 uppercase px-4" style={{ letterSpacing: '0.18em' }}>
        RBAC CONFIGURATION TOOL
      </h1>
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 md:p-12 rounded-lg shadow-lg bg-card">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Sorry, something went wrong.
            </CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">
                Code error: {params.error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                An unspecified error occurred.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
