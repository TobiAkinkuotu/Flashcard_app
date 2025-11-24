// app/index.tsx
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "expo-router";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // mark that component has mounted
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && pathname === "/") {
      router.replace("/(auth)/login"); // redirect to login
    }
  }, [mounted, pathname]);

  return null; // nothing rendered
}
