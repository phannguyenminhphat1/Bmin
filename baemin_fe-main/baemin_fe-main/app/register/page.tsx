'use client'
import Input from '@/components/Input'
import { schema, Schema } from '@/app/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import authApi from '../apis/auth.api'
import { AuthRequestBody } from '../types/auth.type'
import { isAxiosUnprocessableEntityError } from '../utils/utils'
import { ResponseErrorApi } from '../types/utils.type'
import { useContext, useEffect } from 'react'
import { AppContext } from '../contexts/app.context'
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'
import Button from '@/components/Button'
import { Omit } from 'lodash'

type FormData = Omit<Schema, 'price_min' | 'price_max'>
const registerSchema = schema.omit(['price_min', 'price_max'])

const Register: React.FC = () => {
  const { isAuthenticated } = useContext(AppContext)
  useEffect(() => {
    if (isAuthenticated) {
      redirect('/dashboard')
    }
  }, [isAuthenticated])
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  // const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (body: AuthRequestBody) => authApi.registerApi(body)
  })
  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.data.message)
        reset()

        // router.push("/login");
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
    <form onSubmit={onSubmit} className='mt-28 flex w-1/3 flex-col rounded-2xl border bg-white p-5 pb-8'>
      <div className='mb-5 w-full text-center text-[26px] font-semibold text-beamin'>Đăng Kí</div>
      <Input
        className='mb-2 w-full'
        name='full_name'
        placeholder='Họ và tên'
        errorMessage={errors.full_name?.message}
        classNameInput='py-[4px] px-[11px] h-10 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm'
        register={register}
        classNameError='w-full text-red-600 min-h-[1.25rem] text-sm'
      />

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
        name='email'
        placeholder='Email'
        errorMessage={errors.email?.message}
        classNameInput='py-[4px] px-[11px] h-10 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm'
        register={register}
        classNameError='w-full text-red-600 min-h-[1.25rem] text-sm'
      />
      <Input
        className='mb-2 w-full'
        name='phone_number'
        placeholder='Số điện thoại'
        errorMessage={errors.phone_number?.message}
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
      <Input
        className='mb-2 w-full'
        autoComplete='on'
        type='password'
        name='confirm_password'
        placeholder='Nhập lại mật khẩu'
        errorMessage={errors.confirm_password?.message}
        classNameInput='py-[4px] px-[11px] h-10 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm text-sm'
        register={register}
        classNameError='w-full text-red-600 min-h-[1.25rem] text-sm'
      />
      <div className='my-4 w-full'>
        <Button
          className='flex h-[40px] w-full items-center justify-center rounded-lg bg-beamin uppercase text-white'
          isLoading={registerMutation.isPending}
          disabled={registerMutation.isPending}
        >
          Đăng Ký
        </Button>
      </div>
      <div className='flex items-center justify-center gap-1'>
        <span className='text-gray-600'>Bạn đã có tài khoản?</span>
        <Link className='cursor-pointer text-beamin' href={'/login'}>
          Đăng nhập
        </Link>
      </div>
    </form>
  )
}
export default Register
