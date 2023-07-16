"use client";
import Link from "next/link";
import styles from "./header.module.scss";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { GetServerSideProps } from "next";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas <span>+</span>{" "}
            </h1>
          </Link>
          {status === "authenticated" && (
            <Link href="/dashboard" className={styles.link}>
              Meu Painel
            </Link>
          )}
        </nav>
        {status === "authenticated" ? (
          <button
            onClick={() => {
              signOut();
            }}
            className={styles.loginButton}
          >
           Olá {session.user?.name}
            {/* <Image width={20} height={20} src={session.user?.image as string} alt={session.user?.name as string}/> */}
          </button>
        ) : (
          <button
            onClick={(e) => {
              signIn("google");
            }}
            className={styles.loginButton}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}

