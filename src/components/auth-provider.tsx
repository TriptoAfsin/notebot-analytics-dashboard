import { APP_CONFIG } from "@/constants/app-config";
import { getCookie } from "@/utils/cookie-utils";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Routes to the key prompt when no admin key is stored. Whether the key is
 * *valid* is the API's call: a 401 anywhere clears it (see api-client).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = getCookie(APP_CONFIG.secretPassCookie);
    if (!auth && location.pathname !== "/secret-pass") {
      navigate("/secret-pass");
    }
  }, [navigate, location]);

  return <>{children}</>;
}
