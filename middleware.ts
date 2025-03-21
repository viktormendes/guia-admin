import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Verifica se há um parâmetro `token` na URL (após autenticação com o Google)
  const token = searchParams.get("token");

  if (token) {
    // Se o token estiver presente na URL, adiciona-o em um cookie chamado `jwt`
    const response = NextResponse.redirect(new URL("/dashboard", request.url)); // Redireciona para o dashboard
    response.cookies.set("jwt", token, {
      httpOnly: true, // O cookie só pode ser acessado pelo servidor
      secure: process.env.NODE_ENV === "production", // Usa HTTPS em produção
      maxAge: 60 * 60 * 24 * 7, // Expira em 7 dias
      path: "/", // Disponível em toda a aplicação
    });

    return response;
  }

  // Pega o token JWT do cookie
  const jwt = request.cookies.get("jwt")?.value;

  // Se o usuário estiver na rota raiz (`/`)
  if (pathname === "/") {
    if (jwt) {
      // Se o usuário já estiver autenticado, redireciona para `/dashboard`
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Se não estiver autenticado, permite o acesso à rota raiz (`/`)
      return NextResponse.next();
    }
  }

  // Se o usuário estiver em uma rota protegida (`/dashboard/*`)
  if (pathname.startsWith("/dashboard")) {
    if (!jwt) {
      // Se não houver token, redireciona para a página inicial (`/`)
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Faz a requisição para verificar se o usuário é admin
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/user/verifyAdmin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`, // Passa o token JWT no cabeçalho
        },
      });

      if (!res.ok) {
        // Se a resposta não for OK, remove o cookie inválido e redireciona para a página inicial (`/`)
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("jwt");
        return response;
      }

      // Se estiver tudo certo, permite o acesso
      return NextResponse.next();
    } catch (error) {
      // Se houver um erro na requisição, remove o cookie inválido e redireciona para a página inicial (`/`)
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("jwt");
      return response;
    }
  }

  // Se não for uma rota protegida ou de autenticação, permite o acesso
  return NextResponse.next();
}

// Configura o middleware para rodar nas rotas `/dashboard/*` e `/`
export const config = {
  matcher: ["/dashboard/:path*", "/"],
};