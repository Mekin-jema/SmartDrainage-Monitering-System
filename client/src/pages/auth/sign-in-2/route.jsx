import { parseWithZod } from '@conform-to/zod'
// import { setTimeout } from 'node:timers/promises'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import ViteLogo from '~/assets/vite.svg'
import { UserAuthForm } from './components/user-auth-form'

export const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Please enter your password' }).min(7, {
    message: 'Password must be at least 7 characters long',
  }),
})

export const action = async ({ request }) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.email !== 'name@example.com') {
    return {
      lastResult: submission.reply({
        formErrors: ['Invalid email or password'],
      }),
    }
  }
  // await setTimeout(1000)

  throw await redirectWithSuccess('/', {
    message: 'You have successfully logged in!',
  })
}

export default function SignIn2() {
  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Shadcn Admin
        </div>

        <img
          src={ViteLogo}
          className="relative m-auto"
          width={301}
          height={60}
          alt="Vite"
        />

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This template has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">John Doe</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and password below <br />
              to log into your account
            </p>
          </div>
          <UserAuthForm />
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking login, you agree to our{' '}
            <a
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
