'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '@/components/Input'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { schema, Schema } from '../utils/rules'
import authApi from '../apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from '../utils/utils'
import { ResponseErrorApi } from '../types/utils.type'
import { AppContext } from '../contexts/app.context'
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'
import Button from '@/components/Button'

type FormData = Pick<Schema, 'username' | 'password'>
const loginSchema = schema.pick(['username', 'password'])
// ------------------------------
const Login: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useContext(AppContext)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/dashboard')
    }
  }, [isAuthenticated])

  const loginMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) => authApi.loginApi(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.data.message)
        setProfile(result.data.data.user)
        setIsAuthenticated(true)
      },
      onError: (err) => {
        if (isAxiosUnprocessableEntityError<ResponseErrorApi<FormData>>(err)) {
          const formError = err.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) =>
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            )
          }
        }
      }
    })
  })
  return (
    <>
      <form onSubmit={onSubmit} className='mt-14 flex w-1/3 flex-col rounded-2xl border bg-white p-5 pb-8'>
        <div className='mb-3 flex w-full items-center justify-center text-[26px] font-semibold text-beamin'>
          Đăng Nhập
        </div>
        <Input
          className='mb-2 w-full'
          name='username'
          placeholder='Tên đăng nhập'
          errorMessage={errors.username?.message}
          classNameInput='py-[4px] px-[11px] h-10 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm'
          register={register}
          classNameError='w-full text-red-600 min-h-[1.25rem] text-sm'
        />
        <Input
          className='mb-2 w-full'
          autoComplete='on'
          type='password'
          name='password'
          placeholder='Mật khẩu'
          errorMessage={errors.password?.message}
          classNameInput='py-[4px] px-[11px] h-10 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm'
          register={register}
          classNameError='w-full text-red-600 min-h-[1.25rem] text-sm'
        />
        <div className='my-3 w-full'>
          <Button
            className='flex h-[40px] w-full items-center justify-center rounded-lg bg-beamin uppercase text-white'
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            Đăng Nhập
          </Button>
        </div>

        <div className='flex items-center justify-center gap-1'>
          <span className='text-gray-600'>Bạn mới biết đến Baemin?</span>
          <Link className='cursor-pointer text-beamin' href={'/register'}>
            Đăng kí
          </Link>
        </div>
      </form>
    </>
  )
}
export default Login
