import { useEffect, useState } from "react";
import { customFetch } from "../../api-client-react/src/index.js";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/translations";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [location, setLocation] = useLocation();
  const t = useT();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage(t("verify_missingToken"));
      return;
    }

    async function doVerify() {
      try {
        await customFetch(`/api/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || t("verify_fallbackError"));
      }
    }

    doVerify();
  }, [t]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-lg border-border shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t("verify_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 p-10">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground">{t("verify_loading")}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-9 w-9 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{t("verify_successTitle")}</h3>
                  <p className="text-muted-foreground">{t("verify_successDesc")}</p>
                </div>
                <Button className="w-full mt-4" onClick={() => setLocation("/login")}>
                  {t("verify_goToLogin")}
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-9 w-9 text-red-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{t("verify_failedTitle")}</h3>
                  <p className="text-red-500">{errorMessage}</p>
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => setLocation("/register")}>
                  {t("verify_backToReg")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
