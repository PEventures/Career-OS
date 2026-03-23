import { useLocation } from "wouter";
import { useGetMe, useLogin, useRegister, useLogout } from "@workspace/api-client-react";
import { setToken, removeToken, getToken } from "@/lib/utils";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const token = getToken();

  const { data: user, isLoading, error } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        if (!data.user.onboardingCompleted) {
          setLocation("/onboarding");
        } else {
          setLocation("/dashboard");
        }
      },
    }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation("/onboarding");
      },
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSettled: () => {
        removeToken();
        queryClient.clear();
        setLocation("/auth/login");
      }
    }
  });

  useEffect(() => {
    if (error && token) {
      removeToken();
      setLocation("/auth/login");
    }
  }, [error, token, setLocation]);

  return {
    user,
    isLoading: isLoading && !!token,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };
}
