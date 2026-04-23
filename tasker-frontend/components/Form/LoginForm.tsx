'use client'
import { useState } from 'react'
import { useForm, FormProvider, set } from 'react-hook-form'
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
  password: z
    .string()
    .min(6, { message: "Campo deve haver 6 números"})
})

type CreateUserData = z.infer<typeof createUserSchema>

export function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const [invalidLogin, setInvalidLogin] = useState(false);

  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const { 
    handleSubmit, 
    formState: { isSubmitting }, 
    watch,
  } = createUserForm;

  async function handleLogin(data: CreateUserData) {
    const response = await auth.Login(data.email, data.password);

    if (response){
      router.push('/home');
    } else {
      setInvalidLogin(true);
    }
    
  }

  return (
    <main className="h-screen w-full flex flex-row gap-6 items-center justify-center">
      <FormProvider {...createUserForm}>
        <form 
          onSubmit={handleSubmit((data) => {handleLogin(data)})}
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
            <Form.Label htmlFor="password">
              Senha
            </Form.Label>
            <Form.Input type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>

          {invalidLogin && <span className='text-red-500 text-sm'>E-mail ou senha inválidos</span>}
          
          <div className='w-full flex flex-col gap-2'>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#FF7550] text-white rounded px-3 h-10 font-semibold text-sm hover:bg-[#FFA992]"
            >
              LOGIN
            </button>

            <span className='text-center text-gray-500'>ou</span>
                <button 
                  type='button'
                  disabled={isSubmitting}
                  className="bg-white text-orange-primary rounded px-3 h-10 font-semibold text-sm border-[#FF7550] border-2 hover:bg-orangev"
                  onClick={() => router.push('/register')}
                >
                  Registre-se
                </button>
          </div>
        </form>
      </FormProvider>

    </main>
  )
}
