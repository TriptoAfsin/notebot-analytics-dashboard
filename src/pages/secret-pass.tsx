import BrandLogo from "@/components/atoms/brand-logo";
import { Box } from "@/components/atoms/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_CONFIG } from "@/constants/api-config";
import { APP_CONFIG } from "@/constants/app-config";
import { apiClient, statusOf } from "@/lib/api-client";
import { setCookie } from "@/utils/cookie-utils";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * The API checks the password: its DASHBOARD_PASS or ADMIN_KEY env var.
 *
 * This used to compare against VITE_SECRET_PASS in the browser, but Vite
 * inlines VITE_* values into the public bundle, so the "password" was readable
 * by anyone, and the user list it guarded was open on the API anyway.
 */
export default function SecretPassPage() {
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setChecking(true);
    try {
      // the cheapest admin-only call: proves the key without loading data
      await apiClient.get(API_CONFIG.APP_USERS, {
        params: { limit: 1 },
        headers: { "X-Admin-Key": password.trim() },
      });
      setCookie(APP_CONFIG.secretPassCookie, password.trim());
      navigate("/");
    } catch (error) {
      toast.error(
        statusOf(error) === 401
          ? "Wrong password (or too many tries: wait 15 minutes)"
          : "Couldn't reach the analytics API"
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
      <BrandLogo className="size-16" />
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Dashboard password"
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" disabled={checking}>
          {checking ? "Checking…" : "Submit"}
        </Button>
      </form>
    </Box>
  );
}
