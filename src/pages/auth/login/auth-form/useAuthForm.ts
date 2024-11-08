import { useState, useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import authService from '@/services/auth/auth.service'
import { IFormData } from '@/types/types'
import { UserRole } from '@/services/auth/auth.types'

export function useAuthForm(isLogin: boolean) {
	const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormData>()
	const [isPending, startTransition] = useTransition()
	const [failedAttempts, setFailedAttempts] = useState(0)
	const [isBlocked, setIsBlocked] = useState(false)
	const [blockTimer, setBlockTimer] = useState(5)
	const navigate = useNavigate()

	const resetFailedAttempts = useCallback(() => {
		setFailedAttempts(0)
		setIsBlocked(false)
		setBlockTimer(5)
	}, [])

	useEffect(() => {
		if (failedAttempts >= 3) {
			setIsBlocked(true)
			setBlockTimer(5)
			const timer = setInterval(() => {
				setBlockTimer((prevTime) => {
					if (prevTime <= 1) {
						clearInterval(timer)
						resetFailedAttempts()
						return 0
					}
					return prevTime - 1
				})
			}, 1000)
			return () => clearInterval(timer)
		}
	}, [failedAttempts, resetFailedAttempts])

	const redirectBasedOnRole = useCallback((role: string) => {
		console.log('Redirecting based on role:', role)
		switch (role) {
			case 'ZAKAZCHIK':
				navigate('/customer')
				break
			case 'MENEDZHER_PO_RABOTE_S_KLIENTAMI':
				navigate('/client-manager')
				break
			case 'MENEDZHER_PO_ZAKUPKAM':
				navigate('/purchase-manager')
				break
			case 'MASTER':
				navigate('/master')
				break
			case 'DIREKTOR':
				navigate('/director')
				break
			default:
				console.error('Unknown role:', role)
				navigate('/')
		}
	}, [navigate])

	const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: IFormData) => authService.main('login', data),
		onSuccess(data) {
			console.log('Login successful, user data:', data)
			console.log('Full response structure:', JSON.stringify(data, null, 2))
			startTransition(() => {
				reset()
				resetFailedAttempts()
				const userData = data.data.user
				if (userData && userData.roli && userData.roli.length > 0) {
					console.log('User role found:', userData.roli[0])
					redirectBasedOnRole(userData.roli[0])
				} else {
					console.error('User role not found in response. Response structure:', userData)
					navigate('/')
				}
			})
		},
		onError(error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data?.message)
				setFailedAttempts(prev => prev + 1)
			}
		}
	})

	const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
		mutationKey: ['register'],
		mutationFn: (data: IFormData) => authService.main('register', data),
		onSuccess(data) {
			console.log('Registration successful, user data:', data) // Добавим лог для отладки
			startTransition(() => {
				reset()
				redirectBasedOnRole(UserRole.ZAKAZCHIK)
			})
		},
		onError(error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data?.message)
			}
		}
	})

	const onSubmit: SubmitHandler<IFormData> = data => {
		isLogin ? mutateLogin(data) : mutateRegister(data)
	}

	const isLoading = isPending || isLoginPending || isRegisterPending

	return {
		register,
		handleSubmit,
		onSubmit,
		isLoading,
		errors,
		failedAttempts,
		resetFailedAttempts,
		isBlocked,
		blockTimer
	}
}
