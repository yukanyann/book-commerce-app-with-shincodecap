"use client";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

function GithubLoginButton({ providerId }: { providerId: string }) {
  return (
    <button
      onClick={() => signIn(providerId, { callbackUrl: "/" })}
      className="bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center"
    >
      <FaGithub className="mr-2" />
      Githubでログイン
    </button>
  );
}

export default function Login() {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    getProviders().then((providers) => {
      setProviders(providers);
    });
  }, []);

  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.id} className="text-center">
                <GithubLoginButton providerId={provider.id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
