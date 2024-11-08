import React, { useState, useEffect } from 'react'
import clsx from 'clsx'

import styles from './AuthForm.module.scss'
import { AuthToggle } from './AuthToggle'

import { useAuthForm } from './useAuthForm'
import { validatePassword } from '@/utils/validatePassword'

interface AuthFormProps {
	isLogin: boolean
}

export function AuthForm({ isLogin }: AuthFormProps) {
	const { handleSubmit, isLoading, onSubmit, register, errors, failedAttempts, resetFailedAttempts } = useAuthForm(isLogin)
	const [isBlocked, setIsBlocked] = useState(false)
	const [blockTimer, setBlockTimer] = useState(5)

	useEffect(() => {
		if (failedAttempts >= 3) {
			setIsBlocked(true)
			setBlockTimer(5)
			const timer = setInterval(() => {
				setBlockTimer((prevTime) => {
					if (prevTime <= 1) {
						clearInterval(timer)
						setIsBlocked(false)
						resetFailedAttempts()
						return 0
					}
					return prevTime - 1
				})
			}, 1000)
			return () => clearInterval(timer)
		}
	}, [failedAttempts, resetFailedAttempts])

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-sm mx-auto"
		>
			<div className="mb-4">
				<label className="text-gray-600">
					Login
					<input
						type="text"
						placeholder="Enter login: "
						{...register('login', { required: 'Login is required' })}
						className={clsx(
							styles['input-field'],
							'w-full p-2 border rounded focus:outline-none focus:border-blue-500'
						)}
						disabled={isBlocked}
					/>
				</label>
				{errors.login && <p className="text-red-500">{errors.login.message}</p>}
			</div>

			<div className="mb-4">
				<label className="text-gray-600">
					Пароль
					<input
						type="password"
						placeholder="Enter password: "
						{...register('parol', { 
							required: 'Password is required',
							validate: (value) => isLogin || validatePassword(value)
						})}
						className={clsx(
							styles['input-field'],
							'w-full p-2 border rounded focus:outline-none focus:border-blue-500'
						)}
						disabled={isBlocked}
					/>
				</label>
				{errors.parol && <p className="text-red-500">{errors.parol.message}</p>}
			</div>

			<div className="mb-3">
				<button
					type="submit"
					className={clsx(
						styles['btn-primary'],
						isLogin ? 'bg-blue-500' : 'bg-teal-500',
						(isLoading || isBlocked) ? 'opacity-75 cursor-not-allowed' : ''
					)}
					disabled={isLoading || isBlocked}
				>
					{isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
				</button>
			</div>

			{isBlocked && (
				<div className="text-red-500 text-center mb-3">
					Форма заблокирована. Попробуйте снова через {blockTimer} секунд.
				</div>
			)}

			<AuthToggle isLogin={isLogin} />
		</form>
	)
}
