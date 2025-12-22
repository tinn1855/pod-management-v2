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

  const login = async (data: LoginRequest, rememberMe: boolean = true) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(data)
      
      // If tempToken is provided, use it instead of accessToken
      if (response.tempToken) {
        authUtils.setTempToken(response.tempToken, response.user, rememberMe)
      } else if (response.accessToken && response.refreshToken) {
        authUtils.setAuth(
          response.accessToken,
          response.refreshToken,
          response.user,
          rememberMe
        )
      }
      
      toast.success("Login successful!")
      
      // Redirect to change password if mustChangePassword is true
      if (response.user.mustChangePassword) {
        navigate(ROUTES.CHANGE_PASSWORD)
      } else {
        navigate(ROUTES.HOME)
      }
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
      toast.error(finalErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

