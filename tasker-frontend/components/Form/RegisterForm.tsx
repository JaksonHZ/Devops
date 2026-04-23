'use client'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from './index'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'

const createUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "*Campo Obrigatório" })
    .email("Digite um e-mail válido"),
  username: z
    .string()
    .min(1, { message: "*Campo Obrigatório" }),
  password: z
    .string()
    .min(6, { message: "Campo deve haver 6 números"}),
  confirmPassword: z
    .string()
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

type CreateUserData = z.infer<typeof createUserSchema>

export function RegisterForm() {

  const router = useRouter();
  const auth = useAuth();

  const onSubmit = async (data: CreateUserData) => {
    const response = await auth.Register(data.email, data.username, data.password);

    if (response){
      router.push('/');
    } else {
      console.log('Error')
    }
  }

  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const { 
    handleSubmit, 
    formState: { isSubmitting }, 
    watch,
  } = createUserForm;

  const userPassword = watch('password')
  const isPasswordStrong = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').test(userPassword)

  return (
    <main className="h-screen w-full flex flex-row gap-6 items-center justify-center">
      <FormProvider {...createUserForm}>
        <form 
          onSubmit={handleSubmit((data) => {onSubmit(data)})}
          className="flex flex-col gap-4 w-full max-w-xs"
        >

          <Form.Field>
            <Form.Label htmlFor="email">
              E-mail
            </Form.Label>
            <Form.Input type="email" name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="username">
              Username
            </Form.Label>
            <Form.Input type="username" name="username" />
            <Form.ErrorMessage field="username" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">
              Senha

              {isPasswordStrong 
                ? <span className="text-xs text-emerald-600">Senha forte</span>
                : <span className="text-xs text-red-500">Senha fraca</span>}
            </Form.Label>
            <Form.Input type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="confirmPassword">
              Confirme sua senha
            </Form.Label>
            <Form.Input type="password" name="confirmPassword" />
            <Form.ErrorMessage field="confirmPassword" />
          </Form.Field>

          <div className='w-full flex flex-col gap-2'>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#FF7550] text-white rounded px-3 h-10 font-semibold text-sm hover:bg-[#FFA992]"
            >
              Registrar
            </button>

            <span className='text-center text-gray-500'>ou</span>
              <button 
                type='button'
                disabled={isSubmitting}
                className="bg-white text-orange-primary rounded px-3 h-10 font-semibold text-sm border-[#FF7550] border-2 hover:bg-orangev"
                onClick={() => router.push('/')}
              >
                Ir para Login
              </button>
          </div>
        </form>
      </FormProvider>

    </main>
  )
}