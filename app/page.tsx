import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BookOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <BookOpen className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-500">Gestão Acadêmica</CardTitle>
          <CardDescription>Digite suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="m.exemplo@academico.edu" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" asChild>
            <Link href="/dashboard">Entrar</Link>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30"
            asChild
          >
            <Link href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/auth/google/login`} className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <path d="M1.2 12C1.2 6.53 5.73 2 11.2 2C14.56 2 17.51 3.38 19.53 5.6L16.3 8.83"></path>
                <path d="M21.2 12C21.2 17.47 16.67 22 11.2 22C7.84 22 4.89 20.62 2.87 18.4L6.1 15.17"></path>
                <path d="M8.2 10V14L12.2 12L8.2 10Z"></path>
              </svg>
              Entrar com Google
            </Link>
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">Sistema de Gestão Acadêmica © {new Date().getFullYear()}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

