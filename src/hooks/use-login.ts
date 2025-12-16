import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { authUtils } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import type { LoginRequest } from "@/types/auth.types"

export function useLogin() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(data)
      authUtils.setAuth(
        response.accessToken,
        response.refreshToken,
        response.user
      )
      toast.success("Login successful!")
      navigate(ROUTES.HOME)
    } catch (err: unknown) {
      let errorMessage = "Login failed. Please try again."

      if (err instanceof AxiosError) {
        const apiMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : null)
        
        errorMessage = apiMessage || err.message || errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage
      }

      const finalErrorMessage = typeof errorMessage === "string" && errorMessage.trim() 
        ? errorMessage 
        : "Login failed. Please try again."

      setError(finalErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

