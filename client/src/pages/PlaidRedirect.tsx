import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PlaidRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const public_token = params.get("public_token");
    if (public_token) {
      fetch("/api/connect/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token })
      })
        .then(() => {
          navigate("/dashboard");
        });
    }
  }, []);

  return <div>Connecting to your account...</div>;
}
